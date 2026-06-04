document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');
    const chatPaletteMode = document.getElementById('chatPaletteMode');
    const resetButton = document.getElementById('resetButton');
    const outputArea = document.getElementById('outputArea');
    const copyButton = document.getElementById('copyButton');
    const copyMessage = document.getElementById('copyMessage');

    // ロールテーブル生成関数
    const generateRollTable = () => {
        const title = titleInput.value.trim();
        const contentLines = contentInput.value.split('\n').map(line => line.trim()).filter(line => line !== '');

        if (!title && contentLines.length === 0) {
            outputArea.value = 'タイトルと内容を入力してください。';
            return;
        }
        if (!title) {
            outputArea.value = 'タイトルを入力してください。';
            return;
        }
        if (contentLines.length === 0) {
            outputArea.value = 'ロールテーブルの内容を入力してください。';
            return;
        }

        const totalLines = contentLines.length;
        let formattedContent = '';
        for (let i = 0; i < totalLines; i++) {
            formattedContent += `${i + 1}:${contentLines[i]}`;
            if (i < totalLines - 1) {
                formattedContent += '\n';
            }
        }

        let output = `/roll-table\n${title}\n1D${totalLines}\n${formattedContent}`;

        if (chatPaletteMode.checked) {
            output = output.replace(/\n/g, '\\n');
        }

        outputArea.value = output;
    };

    // リセットボタンのイベントリスナー
    resetButton.addEventListener('click', () => {
        titleInput.value = '';
        contentInput.value = '';
        outputArea.value = '';
        chatPaletteMode.checked = false;
        generateRollTable();
        copyMessage.style.opacity = '0'; // リセット時にCopied!も消す
    });

    // コピーボタンのイベントリスナー
    copyButton.addEventListener('click', () => {
        if (outputArea.value) {
            navigator.clipboard.writeText(outputArea.value).then(() => {
                copyMessage.style.opacity = '1';
                // メッセージを少し表示した後、自動で消す
                setTimeout(() => {
                    copyMessage.style.opacity = '0';
                }, 1500); // 1.5秒後に消える
            }).catch(err => {
                console.error('テキストのコピーに失敗しました: ', err);
                alert('コピーに失敗しました。手動でコピーしてください。');
            });
        }
    });

    // 入力内容変更時に自動生成
    titleInput.addEventListener('input', generateRollTable);
    contentInput.addEventListener('input', generateRollTable);
    chatPaletteMode.addEventListener('change', generateRollTable);

    // 初期生成（ページロード時）
    generateRollTable();
});
