# GraphForge — Paper Website

GraphForge: Training Working Agents with Graph-Anchored Workspace Synthesis

- Paper: https://arxiv.org/abs/2609.38923
- Data & models: https://huggingface.co/collections/groundhogLLM/graphforge

## 本地预览

在本文件所在目录运行 `python3 -m http.server 8766`，然后访问 http://localhost:8766 。远程服务器需要先转发对应端口。

## 发布到 GitHub Pages

将本文件所在文件夹的**内容**作为 GitHub 仓库的根目录上传，包括隐藏的 `.github/` 和 `.nojekyll`。无需安装依赖、构建或运行后端。

仓库默认分支使用 `main`，在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。推送后，自带的 `.github/workflows/pages.yml` 会部署页面。使用其他分支时，修改 workflow 中的 `branches`。

## 修改页面

- `index.html`：标题、作者、摘要、结果表和 arXiv BibTeX。
- `assets/style.css`：布局、字体大小与手机适配。
- `assets/main.js`：步骤切换、模型结果对比、图片放大和复制引用。
- `assets/site-config.js`：Paper 与 Hugging Face 链接。
- `assets/figures/`：论文图的网页版本。

所有字体、图标、样式、图片和交互均随页面提供，无需第三方 CDN。DM Sans 与 Manrope 的 SIL Open Font License 附在 `assets/fonts/`。

## 文件夹名与访问网址

本地 `graphforge_github_pages` 文件夹的名字用于整理文件，不决定站点地址。上传时，将其**内部所有内容**放到 GitHub 仓库根目录。

- 例如 GitHub 账号为 `yourname`、仓库为 `GraphForge`，项目主页通常是 `https://yourname.github.io/GraphForge/`。
- 如果仓库名专门使用 `yourname.github.io`，账号主页通常是 `https://yourname.github.io/`。
- 上传文件并启用 Pages、等待 Actions 部署成功后，其他人即可访问该网址。最终地址以仓库 Settings → Pages 显示的地址为准。

GitHub 官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
