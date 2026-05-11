---
name: magus-framework-pdf
description: 生成符合 Magus framework PDF ：依赖与配置、模板组织、FreemarkerRenderer/PdfRenderer 用法（输出 File/OutputStream）、Controller 下载示例、静态资源与字体、分页变量、常见坑与排查。当用户要在业务代码中生成/下载 PDF（framework-pdf）时使用。
---

# Magus `framework-pdf` 实战技能

## 你要“做成什么效果”

当用户说“我要生成 PDF / 下载 PDF / 用模板渲染 PDF”，你需要给出可直接落地的方案，至少包含：

- **依赖引入**：业务服务如何依赖 `framework-pdf`
- **模板放哪里**：`resources/templates/**` 的组织方式（模块/目录/xxx.ftl）
- **最常见业务场景示例**：Controller 返回 `application/pdf` 下载
- **渲染 API 选择**
  - 仅 HTML：`FreemarkerRenderer.process(...)`
  - HTML → PDF：`PdfRenderer.process(template/context, outputStream|file)`
- **静态资源**：CSS/图片引用方式（baseUri 来自模板路径）
- **分页变量**：`pdf_pageNumber`、`pdf_totalPages` 的用法与限制
- **常见坑**：字体/中文、资源路径、模板加载失败、临时文件清理

## 模块事实（来自 `framework-pdf`）

- **自动装配入口**：Spring Boot `AutoConfiguration.imports` 导入 `PdfConfig`
- **对外可用组件**
  - `FreemarkerRenderer`：加载/渲染 `.ftl` 为 HTML；支持 `newTemplate(name, sourceCode)` 运行时模板
  - `PdfRenderer`：使用 iText7 `html2pdf` 将 HTML 转 PDF；会为模板计算 `baseUri` 以便加载同目录资源
- **模板路径基准**：`classpath:/templates/`（`FreemarkerRenderer#getTemplateBaseUri` 会用 `templates/{templateName}` 求 URI）
- **分页变量（仅 File 输出版本会注入）**
  - `PdfRenderer.process(template, context, File)` 会在 `END_PAGE` 事件里写入：
    - `context.put("pdf_pageNumber", pageNumber)`
    - `context.put("pdf_totalPages", totalPages)`

## 业务侧接入（必须给用户的“照抄版”）

### 1) Maven 依赖

如果当前业务项目内没有引入 `framework-pdf`，需要业务服务 `pom.xml` 增加：

```xml
<dependency>
  <groupId>com.magus.cloud</groupId>
  <artifactId>framework-pdf</artifactId>
</dependency>
```

> `framework-pdf` 已包含 Freemarker（`spring-boot-starter-freemarker`）与 iText7 html2pdf 依赖。

### 2) 模板与静态资源组织（直接按这个放）

把模板放在业务工程：

- `src/main/resources/templates/{模块}/{目录}/xxx.ftl`
- 同目录可放 CSS/图片等静态资源（被 HTML 引用时依赖 `baseUri`）

模块内 README 建议：使用“文件夹区分模板”，按 `模块/模板目录/模板.ftl` 组织。

示例：

- `templates/invoice/v1/index.ftl`
- `templates/invoice/v1/css/index.css`
- `templates/invoice/v1/img/logo.png`

`index.ftl` 内引用：

```html
<link rel="stylesheet" href="css/index.css"/>
<img src="img/logo.png"/>
```

### 3) 最常见业务场景：接口直接下载 PDF

```java
@RestController
@RequestMapping("/pdf")
public class PdfDownloadController {

  @Autowired
  private com.magus.cloud.framework.pdf.service.PdfRenderer pdfRenderer;

  @Autowired
  private com.magus.cloud.framework.pdf.service.FreemarkerRenderer freemarkerRenderer;

  @GetMapping(value = "/invoice/{id}", produces = "application/pdf")
  public byte[] downloadInvoice(@PathVariable Long id) throws Exception {
    freemarker.template.Template template = freemarkerRenderer.getTemplate("invoice/v1/index.ftl");

    java.util.Map<String, Object> ctx = new java.util.HashMap<>();
    ctx.put("id", id);
    // ctx.put("items", items);
    // ctx.put("company", company);

    try (java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
      pdfRenderer.process(template, ctx, out);
      return out.toByteArray();
    }
  }
}
```

> 如果你要设置文件名/Disposition，业务侧自行在响应头里加 `Content-Disposition: attachment; filename=...pdf`。

### 4) 需要分页变量时：用 File 版本渲染

`PdfRenderer.process(template, context, OutputStream)` **不会** 注入 `pdf_pageNumber/pdf_totalPages`；需要分页信息时用：

```java
freemarker.template.Template template = freemarkerRenderer.getTemplate("invoice/v1/index.ftl");
java.util.Map<String, Object> ctx = new java.util.HashMap<>();

java.io.File pdf = java.io.File.createTempFile("invoice-", ".pdf");
pdfRenderer.process(template, ctx, pdf);
// ctx 里会被注入 pdf_pageNumber/pdf_totalPages（在渲染过程中）
```

> 实战建议：用完临时文件要清理；或者写到你们的对象存储后删本地文件。

### 5) 只想渲染 HTML（便于调试模板）

```java
String html = freemarkerRenderer.process("invoice/v1/index.ftl", ctx);
```

## 常见坑 & 排查清单（实战必备）

### 1) 中文/字体显示异常

`PdfRenderer` 会注册系统字体（`fontProvider.addSystemFonts()`），但在容器环境（精简镜像）可能没有中文字体。

- 现象：中文变方块/缺字
- 处理：给运行环境安装中文字体（或换包含字体的基础镜像）

### 2) CSS/图片加载失败

框架用模板的 classpath URI 做 `baseUri`，因此：

- 资源路径要用相对路径（如 `css/index.css`、`img/logo.png`）
- 模板与资源放同目录或相对可达目录

### 3) 模板加载/渲染异常

`FreemarkerRenderer` 会把“模板加载错误/渲染错误”包装成 `BaseException`。

- 排查：确认模板路径是相对 `templates/` 的路径（例如 `invoice/v1/index.ftl`）

## 你在回答用户时的“输出模板”

- **依赖**：`framework-pdf` 依赖片段
- **模板结构**：`resources/templates/{模块}/{目录}/xxx.ftl` + 同目录资源
- **代码**：Controller 下载示例（`PdfRenderer.process(template, ctx, out)`）
- **分页**：如果要页码，说明必须用 `process(template, ctx, File)`
- **坑位**：字体/中文、资源 baseUri、模板路径
