#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log("📊 聚合测试覆盖率...");

const packagesDir = path.join(__dirname, "packages");
const packages = fs.readdirSync(packagesDir)
  .filter(dir => {
    const packagePath = path.join(packagesDir, dir);
    return fs.statSync(packagePath).isDirectory() && 
           fs.existsSync(path.join(packagePath, "package.json"));
  });

const coverageDirs = packages
  .map(pkg => path.join(__dirname, "packages", pkg, "coverage"))
  .filter(dir => fs.existsSync(dir));

if (coverageDirs.length === 0) {
  console.log("  ⚠️  没有覆盖率报告");
  process.exit(0);
}

// 创建合并后的覆盖率目录
const mergedCoverageDir = path.join(__dirname, "coverage");
if (!fs.existsSync(mergedCoverageDir)) {
  fs.mkdirSync(mergedCoverageDir, { recursive: true });
}

// 简单复制覆盖率文件
coverageDirs.forEach((dir, index) => {
  const pkgName = packages[index];
  const targetDir = path.join(mergedCoverageDir, pkgName);
  
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true });
  }
  
  if (fs.existsSync(dir)) {
    fs.cpSync(dir, targetDir, { recursive: true });
    console.log("    📁 复制 " + pkgName + " 覆盖率报告");
  }
});

console.log("  ✅ 覆盖率报告已生成: " + mergedCoverageDir);
