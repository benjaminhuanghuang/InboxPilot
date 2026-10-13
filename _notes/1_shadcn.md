# Shadcn

```sh
@base-ui/react — shadcn base-nova style 用的无样式组件库（Radix 的替代，shadcn CLI 新预设默认用这个）
class-variance-authority — 组件 variant（如 Button 的 size/variant）管理
cn + lib/utils.ts 里的 cn() — className 合并 helper（clsx + tailwind-merge 的替代包）
lucide-react — 图标库（components.json 里 iconLibrary: "lucide"）
tw-animate-css — Tailwind v4 动画工具类（代替老版 tailwindcss-animate）
shadcn — CLI 本身，被装进 dependencies（CLI 默认行为，不是我手动放的；一般可以挪到 devDependencies）
```

- Modify app/globals.css
- Add components.json — shadcn CLI 配置

Add component

```sh
npx shadcn@latest add label button input card badge table sonner chart tooltip
npx shadcn@latest add field empty spinner
npx shadcn@latest add skeleton sonner alert-dialog alert dropdown-menu separator select textarea
```
