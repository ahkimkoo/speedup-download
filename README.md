# speedup-download

nodejs 大文件分片下载工具，使用进程process的方式分片下载，文件合并使用filestream，不受nodejs单进程的内存限制可以下载较大的文件。

## 用法

## 安装

全局安装

```
npm install speedup-download
```
如果要全局安装请加上-g参数

全局安装模式下，可以直接当做下载工具使用：

```
speedup-download "http://xxx/big-file.zip" big-file.zip 4
```
表示４个分片并发下载

在项目中引用：

```
const speedup_download = require('speedup-download');

(async() => {
        var url = 'http://bla..../file.mp4';
        var filepath = 'filename.mp4';
        var con_num = 4;

        let stime = new Date().getTime();
        console.log('start download, concurrency: ' + con_num);

        var downloader = new speedup_download.Downloader(url, filepath, {
            'concurrency': con_num,
            'progress_throttle': 4000
        });

        downloader.onProgress((pct, tinfo, pinfo) => {
            console.log('progress:',pct);
        });

        let ret = await downloader.download();

        console.log('download ' + (ret ? 'success' : 'fail') + ', cost: ' + (new Date().getTime() - stime) + 'ms');
})();
```