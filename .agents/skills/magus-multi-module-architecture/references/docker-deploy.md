项目内通常有一个顶层 `Dockerfile`，用于打包 `magus-xxx-facade` 生成的 jar：

```dockerfile
# 基础镜像 可替换 openjdk:17-jdk
FROM openjdk:17-oracle

# 镜像作者
MAINTAINER magus

# 声明端口（必须与 application.yml 中 server.port 一致）
EXPOSE 11821

# 设定时区
ENV TZ=Asia/Shanghai
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 添加 jar 包
ADD magus-xxx-facade/target/***.jar app.jar

# 启动命令
ENTRYPOINT java \
  --add-opens=java.base/java.lang=ALL-UNNAMED \
  --add-opens=java.base/java.lang.reflect=ALL-UNNAMED \
  -Djava.security.egd=file:/dev/./urandom \
  -jar /app.jar
```

Claude 在生成或检查 Dockerfile 时应：

- 只允许打包 `facade` 模块
- Dockerfile 必须位于项目根目录
- 提醒用户**将 `EXPOSE` 的端口与 `application.yml` 中的 `server.port` 保持一致**
- 确认 `ADD` 路径指向 `magus-xxx-facade` 的打包产物（`target/*.jar`），名称必须为 `${project.build.finalName}.jar`
- 若用户指定了 JDK 版本或基础镜像风格（如 `eclipse-temurin`），则按用户偏好调整 FROM 部分

---