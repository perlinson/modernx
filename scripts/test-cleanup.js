#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log("🧹 清理测试环境...");

// 清理覆盖率报告
const coverageDir = path.join(__dirname, "coverage");
if (fs.existsSync(coverageDir)) {
  fs.rmSync(coverageDir, { recursive: true });
  console.log("  🗑️  清理覆盖率报告");
}

// 清理临时文件
const tempDirs = [".nyc_output", ".coverage"];
tempDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true });
    console.log("  🗑️  清理临时目录: " + dir);
  }
});

console.log("✅ 测试环境清理完成");
