# README

```mermaid
stateDiagram-v2
  [*] --> pending
  pending --> uploading: 开始上传
  pending --> stopped
  uploading --> stopping: 停止中，等待上传完当前片段
  stopping --> stopped: 上传完当前片段
  uploading --> finished: 上传完成
  stopped --> pending: 继续上传
  finished --> [*]
```
