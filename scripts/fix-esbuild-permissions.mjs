#!/usr/bin/env node
/**
 * 修复 Windows 沙箱环境下 esbuild/Playwright spawn EPERM 问题。
 * 在 vitest / playwright 启动前运行此脚本。
 */
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

// 1. 查找 esbuild 二进制并确保可执行
const esbuildBin = path.join(repoRoot, "node_modules", ".bin", "esbuild.cmd");
if (fs.existsSync(esbuildBin)) {
  try {
    fs.chmodSync(esbuildBin, 0o755);
    console.log(`OK: esbuild binary permissions fixed: ${esbuildBin}`);
  } catch (err) {
    console.warn(`WARN: cannot chmod esbuild binary: ${err.message}`);
  }
}

// 2. 设置 ESBUILD_BINARY_PATH 指向 .exe 避免 spawn .cmd 包装
const esbuildExe = path.join(repoRoot, "node_modules", "@esbuild", `win32-${process.arch}`, "esbuild.exe");
if (fs.existsSync(esbuildExe)) {
  process.env.ESBUILD_BINARY_PATH = esbuildExe;
  console.log(`OK: ESBUILD_BINARY_PATH set to ${esbuildExe}`);
} else {
  console.warn(`WARN: esbuild native binary not found at ${esbuildExe}`);
}

console.log("OK: permission pre-check completed");
