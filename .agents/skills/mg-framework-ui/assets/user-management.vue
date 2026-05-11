<template>
  <div class="user-management" flex flex-col h-full min-h-0>
    <!-- 工具栏：包含新增、删除等操作 -->
    <MgToolbar
      :select-length="selectedUsers.length"
      @event-handle="handleToolbarEvent"
    />

    <!-- 用户表格：展示用户列表，支持分页、选择、编辑、删除 -->
    <div class="table-container" flex-1 min-h-0>
      <MgTable
        :data="userList"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        @paging-change="loadUserData"
        @selection-change="handleSelectionChange"
      >
        <!-- 显示列：选择、用户名、邮箱、角色等 -->
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === "admin" ? "管理员" : "普通用户" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <!-- 操作列：编辑、删除按钮 -->
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <MgButton type="primary" size="small" @click="handleEdit(row)">
              编辑
            </MgButton>
            <MgButton type="danger" size="small" @click="handleDelete(row)">
              删除
            </MgButton>
          </template>
        </el-table-column>
      </MgTable>
    </div>

    <!-- 编辑对话框：用于新增或编辑用户 -->
    <MgDialog v-model="editDialogVisible" title="编辑用户" width="500px">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            v-model="formData.email"
            type="email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <el-select v-model="formData.role">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :active-value="'active'"
            :inactive-value="'inactive'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <MgButton @click="editDialogVisible = false">取消</MgButton>
        <MgButton type="primary" :loading="submitting" @click="handleSubmit">
          保存
        </MgButton>
      </template>
    </MgDialog>
  </div>
</template>

<script setup lang="ts">
import { MgButton, MgDialog, MgTable, MgToolbar } from "@magustek/framework-ui";
import { ElMessage } from "element-plus";
import type { FormInstance, FormItemRule } from "element-plus";
import { onMounted, reactive, ref } from "vue";

// 获取用户管理的API方法
import {
  createUser,
  deleteUser,
  deleteUsers,
  getUsers,
  updateUser,
  type User,
} from "@/api/user";

// 表单引用
const formRef = ref<FormInstance>();

// 状态管理
const userList = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const editDialogVisible = ref(false);
const submitting = ref(false);
const isEditing = ref(false);
const editingUserId = ref<number | string | null>(null);

// 表单数据
const formData = reactive({
  username: "",
  email: "",
  role: "user" as "admin" | "user",
  status: "active" as "active" | "inactive",
});

// 表单验证规则
const formRules: Record<string, FormItemRule[]> = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email" as any, message: "请输入正确的邮箱地址", trigger: "blur" },
  ],
};

// 加载用户数据
const loadUserData = async () => {
  try {
    const response = await getUsers(currentPage.value, pageSize.value);
    userList.value = response.list;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("加载用户数据失败");
  }
};

// 处理选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection;
};

// 处理工具栏事件
const handleToolbarEvent = (code: string) => {
  if (code === "add") {
    // 新增用户
    isEditing.value = false;
    editingUserId.value = null;
    formData.username = "";
    formData.email = "";
    formData.role = "user";
    formData.status = "active";
    editDialogVisible.value = true;
  } else if (code === "batchDelete") {
    // 批量删除
    handleBatchDelete();
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning("请先选择要删除的用户");
    return;
  }

  try {
    const userIds = selectedUsers.value.map((user) => user.id);
    const success = await deleteUsers(userIds);

    if (success) {
      ElMessage.success("批量删除成功");
      loadUserData();
      selectedUsers.value = [];
    } else {
      ElMessage.error("批量删除失败");
    }
  } catch (error) {
    ElMessage.error("批量删除失败");
  }
};

// 编辑用户
const handleEdit = (row: User) => {
  isEditing.value = true;
  editingUserId.value = row.id;
  formData.username = row.username;
  formData.email = row.email;
  formData.role = row.role;
  formData.status = row.status;
  editDialogVisible.value = true;
};

// 删除用户
const handleDelete = async (row: User) => {
  try {
    const success = await deleteUser(row.id);
    if (success) {
      ElMessage.success("删除成功");
      loadUserData();
    } else {
      ElMessage.error("删除失败");
    }
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

// 处理状态变化
const handleStatusChange = async (row: User) => {
  try {
    const success = await updateUser(row.id, { status: row.status });
    if (success) {
      ElMessage.success("状态更新成功");
    } else {
      ElMessage.error("状态更新失败");
    }
  } catch (error) {
    ElMessage.error("状态更新失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (!valid) return;

  submitting.value = true;
  try {
    if (isEditing.value && editingUserId.value) {
      // 编辑用户
      const success = await updateUser(editingUserId.value, formData);
      if (success) {
        ElMessage.success("更新成功");
        editDialogVisible.value = false;
        loadUserData();
      } else {
        ElMessage.error("更新失败");
      }
    } else {
      // 新增用户
      const newUser = await createUser(formData);
      if (newUser) {
        ElMessage.success("创建成功");
        editDialogVisible.value = false;
        loadUserData();
      } else {
        ElMessage.error("创建失败");
      }
    }
  } catch (error) {
    ElMessage.error("操作失败");
  } finally {
    submitting.value = false;
  }
};

// 初始加载
onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
.user-management {
  padding: 20px;
}

/* 表格容器 - 确保表格撑满高度 */
.table-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 确保MgTable组件撑满容器 */
.table-container :deep(.mg-table) {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex: 1;
  flex-direction: column;
}

/* 确保el-table撑满MgTable */
.table-container :deep(.el-table) {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

/* 确保表格内部结构正确 */
.table-container :deep(.el-table__inner-wrapper) {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

/* 表头固定高度 */
.table-container :deep(.el-table__header-wrapper) {
  flex-shrink: 0;
}

/* 表体撑满剩余空间 */
.table-container :deep(.el-table__body-wrapper) {
  flex: 1;
  overflow-y: auto;
}
</style>
