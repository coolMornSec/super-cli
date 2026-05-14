# MgLayout 组件

> 企业级布局组件，支持侧边栏、头部、主内容、底部的完整页面布局

## 基本介绍

`MgLayout` 是一个功能完整的页面布局组件，提供以下核心功能：

- **侧边栏支持** - 可折叠的左侧侧边栏
- **完整布局** - 支持头部、侧边栏、主内容、底部四个区域
- **自动滚动** - 主内容区域自动添加滚动条
- **响应式间距** - 支持自定义区域间距
- **平滑动画** - 侧边栏折叠/展开有平滑过渡效果

## Props

| 属性名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| `asideWidth` | `string` | `'300px'` | ❌ | 侧边栏宽度 |
| `gap` | `string` | `'16px'` | ❌ | 各区域间距 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| `aside` | 左侧侧边栏内容 |
| `header` | 顶部头部内容 |
| `main` | 主内容区域 |
| `footer` | 底部页脚内容 |

## 特性说明

### 侧边栏折叠

- 侧边栏右侧有一个可点击的折叠按钮
- 点击按钮可以平滑地折叠/展开侧边栏
- 折叠时侧边栏宽度变为 0，主内容自动扩展


### 响应式布局

- 所有区域都是响应式的
- 支持自定义间距
- 自动处理侧边栏折叠时的布局调整

## 代码示例

### 完整的管理后台布局

```vue
<template>
  <MgLayout aside-width="280px" gap="16px">
    <!-- 侧边栏菜单 -->
    <template #aside>
      <div class="sidebar">
        <div class="logo">
          <img src="/logo.png" alt="Logo" />
          <span>管理系统</span>
        </div>
        <el-menu :default-active="activeMenu" @select="handleMenuSelect">
          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="users">用户管理</el-menu-item>
            <el-menu-item index="roles">角色管理</el-menu-item>
            <el-menu-item index="permissions">权限管理</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </template>

    <!-- 顶部导航栏 -->
    <template #header>
      <div class="navbar">
        <div class="navbar-left">
          <span>欢迎，{{ userName }}</span>
        </div>
        <div class="navbar-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userName }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </template>

    <!-- 主内容区域 -->
    <template #main>
      <router-view />
    </template>

    <!-- 底部 -->
    <template #footer>
      <div class="footer">
        <p>© 2026 Company. All rights reserved.</p>
      </div>
    </template>
  </MgLayout>
</template>

<script setup lang="ts">
import { ArrowDown, Setting } from '@element-plus/icons-vue'
import { MgLayout } from '@magustek/framework-ui'
import { ref } from 'vue'

const activeMenu = ref('setting')
const userName = ref('Admin')

const handleMenuSelect = (index: string) => {
  console.log('选择菜单:', index)
  // 路由导航逻辑
}
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  .logo {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding: 16px;
    border-bottom: 1px solid #eee;
    gap: 8px;

    img {
      width: 32px;
      height: 32px;
    }

    span {
      font-size: 16px;
      font-weight: 600;
    }
  }

  :deep(.el-menu) {
    flex: 1;
    border: none;
  }
}

.navbar {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;

  .navbar-left {
    font-size: 14px;
    color: #333;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      color: #409eff;
      cursor: pointer;
      gap: 4px;
    }
  }
}

.footer {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #eee;
  background-color: #fafafa;

  p {
    margin: 0;
    font-size: 12px;
    color: #999;
  }
}
</style>

```

## 类型定义

```typescript
interface MgLayoutProps {
  asideWidth?: string
  gap?: string
}
```


## 注意事项

1. **侧边栏可选** - 如果不提供 `aside` 插槽，侧边栏不会显示
2. **主内容必需** - `main` 插槽是必需的，其他插槽都是可选的
3. **高度设置** - 组件默认填满整个容器，确保父容器有明确的高度
4. **滚动条** - 主内容区域自动添加滚动条，无需手动处理
5. **侧边栏宽度** - 可以使用 CSS 单位（px、%、em 等）设置侧边栏宽度
6. **间距调整** - `gap` 属性控制各区域之间的间距，默认为 16px

## 最佳实践

### 1. 完整的后台管理布局

使用 `MgLayout` 构建完整的后台管理系统布局，包括侧边栏菜单、顶部导航栏和主内容区域。

---

**最后更新**: 2026-03-06
