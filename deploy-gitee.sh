#!/usr/bin/env bash
# 构建静态产物并推送到 Gitee 的 gh-pages 分支，供 Gitee Pages 部署
# 用法：./deploy-gitee.sh   然后到 Gitee Pages 页面点击「更新」
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> 构建静态导出（basePath=/resume）"
NEXT_PUBLIC_BASE_PATH=/resume npm run build

TMP="$(mktemp -d)"
trap 'git worktree remove --force "$TMP" 2>/dev/null || true; git worktree prune' EXIT

echo "==> 生成 gh-pages 分支内容"
git worktree add --detach "$TMP" HEAD >/dev/null
(
  cd "$TMP"
  git checkout --orphan gh-pages >/dev/null 2>&1
  git rm -rf --quiet . >/dev/null 2>&1 || true
  cp -r "$ROOT/out/." .
  touch .nojekyll
  git add -A
  git -c user.name="deploy" -c user.email="deploy@local" \
    commit -q -m "chore: Gitee Pages 静态产物"
)

echo "==> 推送 gh-pages → gitee"
git push -f gitee gh-pages

echo "==> 完成！请到 Gitee 仓库「服务 → Gitee Pages」点击「更新」部署。"
