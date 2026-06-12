document.addEventListener('DOMContentLoaded', () => {
    // タブ要素
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // 通常ロールテーブルタブの要素
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');
    const chatPaletteMode = document.getElementById('chatPaletteMode');
    const resetButton = document.getElementById('resetButton');
    const outputArea = document.getElementById('outputArea');
    const copyButton = document.getElementById('copyButton');
    const copyMessage = document.getElementById('copyMessage');

    // Choiceダイス変換タブの要素
    const choiceTitleInput = document.getElementById('choiceTitleInput');
    const choiceInput = document.getElementById('choiceInput');
    const choiceChatPaletteMode = document.getElementById('choiceChatPaletteMode');
    const choiceResetButton = document.getElementById('choiceResetButton');
    const choiceOutputArea = document.getElementById('choiceOutputArea');
    const choiceCopyButton = document.getElementById('choiceCopyButton');
    const choiceCopyMessage = document.getElementById('choiceCopyMessage');

    // タブ切り替え機能
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');

            // タブ切り替え時に各タブの生成関数を呼び出す
            if (button.dataset.tab === 'rollTableTab') {
                generateRollTable();
            } else if (button.dataset.tab === 'choiceDiceTab') {
                generateChoiceRollTable();
            }
        });
    });

    // ロールテーブル生成関数 (通常タブ)
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

    // Choiceダイス変換ロールテーブル生成関数 (Choiceタブ)
    const generateChoiceRollTable = () => {
        const title = choiceTitleInput.value.trim();
        const choiceText = choiceInput.value.trim();

        if (!title && choiceText === '') {
            choiceOutputArea.value = 'タイトルとChoiceダイスの内容を入力してください。';
            return;
        }
        if (!title) {
            choiceOutputArea.value = 'タイトルを入力してください。';
            return;
        }
        if (choiceText === '') {
            choiceOutputArea.value = 'Choiceダイスの内容を入力してください。';
            return;
        }

        let items = [];
        // choice[項目1,項目2,...,項目n] 形式
        const bracketMatch = choiceText.match(/choice\[(.*?)\]/);
        if (bracketMatch && bracketMatch[1]) {
            items = bracketMatch[1].split(',').map(item => item.trim()).filter(item => item !== '');
        } 
        // choice(項目1,項目2,...,項目n) 形式
        else if (choiceText.match(/choice\((.*?)\)/)) {
            const parenthesisMatch = choiceText.match(/choice\((.*?)\)/);
            if (parenthesisMatch && parenthesisMatch[1]) {
                items = parenthesisMatch[1].split(',').map(item => item.trim()).filter(item => item !== '');
            }
        }
        // choice 項目1 項目2 ... 項目n 形式 (スペース区切り)
        else {
            const spaceMatch = choiceText.match(/choice\s+(.*)/);
            if (spaceMatch && spaceMatch[1]) {
                items = spaceMatch[1].split(/\s+/).map(item => item.trim()).filter(item => item !== '');
            }
        }

        if (items.length === 0) {
            choiceOutputArea.value = '有効なChoiceダイスの項目が見つかりませんでした。';
            return;
        }

        const totalItems = items.length;
        let formattedContent = '';
        for (let i = 0; i < totalItems; i++) {
            formattedContent += `${i + 1}:${items[i]}`;
            if (i < totalItems - 1) {
                formattedContent += '\n';
            }
        }

        let output = `/roll-table\n${title}\n1D${totalItems}\n${formattedContent}`;

        if (choiceChatPaletteMode.checked) {
            output = output.replace(/\n/g, '\\n');
        }

        choiceOutputArea.value = output;
    };

    // リセットボタンのイベントリスナー (通常タブ)
    resetButton.addEventListener('click', () => {
        titleInput.value = '';
        contentInput.value = '';
        outputArea.value = '';
        chatPaletteMode.checked = false;
        generateRollTable();
        copyMessage.style.opacity = '0';
    });

    // リセットボタンのイベントリスナー (Choiceタブ)
    choiceResetButton.addEventListener('click', () => {
        choiceTitleInput.value = '';
        choiceInput.value = '';
        choiceOutputArea.value = '';
        choiceChatPaletteMode.checked = false;
        generateChoiceRollTable();
        choiceCopyMessage.style.opacity = '0';
    });

    // コピーボタンのイベントリスナー (通常タブ)
    copyButton.addEventListener('click', () => {
        if (outputArea.value) {
            navigator.clipboard.writeText(outputArea.value).then(() => {
                copyMessage.style.opacity = '1';
                setTimeout(() => {
                    copyMessage.style.opacity = '0';
                }, 1500);
            }).catch(err => {
                console.error('テキストのコピーに失敗しました: ', err);
                alert('コピーに失敗しました。手動でコピーしてください。');
            });
        }
    });

    // コピーボタンのイベントリスナー (Choiceタブ)
    choiceCopyButton.addEventListener('click', () => {
        if (choiceOutputArea.value) {
            navigator.clipboard.writeText(choiceOutputArea.value).then(() => {
                choiceCopyMessage.style.opacity = '1';
                setTimeout(() => {
                    choiceCopyMessage.style.opacity = '0';
                }, 1500);
            }).catch(err => {
                console.error('テキストのコピーに失敗しました: ', err);
                alert('コピーに失敗しました。手動でコピーしてください。');
            });
        }
    });

    // 入力内容変更時に自動生成 (通常タブ)
    titleInput.addEventListener('input', generateRollTable);
    contentInput.addEventListener('input', generateRollTable);
    chatPaletteMode.addEventListener('change', generateRollTable);

    // 入力内容変更時に自動生成 (Choiceタブ)
    choiceTitleInput.addEventListener('input', generateChoiceRollTable);
    choiceInput.addEventListener('input', generateChoiceRollTable);
    choiceChatPaletteMode.addEventListener('change', generateChoiceRollTable);

    // 初期生成（ページロード時）
    // アクティブなタブの内容を生成する
    if (document.querySelector('.tab-button.active').dataset.tab === 'rollTableTab') {
        generateRollTable();
    } else {
        generateChoiceRollTable();
    }
});
