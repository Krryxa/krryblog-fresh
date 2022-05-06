#!/bin/sh
set -e
begin_time=$(date +%s)
echo $(date +"%Y-%m-%d %H:%M:%S") 'build start'

# 拉取 git 仓库
git clone git@github.com:Krryxa/krryblog-fresh.git
git clone git@github.com:Krryxa/krryblog-egg.git
git clone git@github.com:Krryxa/krryblog-egg-config.git

echo $(date +"%Y-%m-%d %H:%M:%S") 'client begin'
# 前端构建
cd krryblog-fresh
yarn
yarn build
echo $(date +"%Y-%m-%d %H:%M:%S") 'client end'

echo $(date +"%Y-%m-%d %H:%M:%S") 'server begin'
# 服务端构建
cd ../krryblog-egg
# 将 krryblog-egg-config 的 config.prod.ts 文件移动到 config 目录
mv ../krryblog-egg-config/config.prod.ts config/
# 安装所有依赖用于编译 ts
yarn
yarn tsc
 # 删除所有依赖
rm -rf node_modules
# 判断是否存在 view 目录，不存在则创建
if [ ! -d app/view ]; then
  mkdir app/view
fi
# 将打包好的 app/public/index.html 移动到 app/view/ 目录
mv app/public/index.html app/view/
# 复制服务端到指定部署目录
cd .. && cp -r krryblog-egg new_krryblog
# 删除 git 仓库
rm -rf krryblog-fresh
rm -rf krryblog-egg
rm -rf krryblog-egg-config
# 安装生产环境依赖
cd new_krryblog && yarn install --production
cd ..
echo $(date +"%Y-%m-%d %H:%M:%S") 'server end'

echo $(date +"%Y-%m-%d %H:%M:%S") 'build end'

echo $(date +"%Y-%m-%d %H:%M:%S") 'deploy start'
# 保证干净的部署目录
if [ -d krryblog ]; then
  # 如果有，先停止服务
  cd krryblog && yarn stop
  # 然后将资源文件转移到新目录
  mv app/public/music ../new_krryblog/app/public && mv app/public/upload ../new_krryblog/app/public
  # 再删除目录
  cd .. && rm -rf krryblog
fi
# 重命名
mv new_krryblog krryblog && cd krryblog
# 运行
yarn start
echo $(date +"%Y-%m-%d %H:%M:%S") 'deploy end'

end_time=$(date +%s)
cost_time=$(($end_time - $begin_time))
echo "执行共花费：$cost_time 秒"