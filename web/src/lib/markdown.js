export function convertToHtml(message) {

    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.role}`;

    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';

    // Convert markdown-like syntax to HTML
    let content = message.content;

    // Code blocks (```code```)
    content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code (`code`)
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold (**text**)
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Headers (# Header)
    content = content.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    content = content.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    content = content.replace(/^### (.*?)$/gm, '<h3>$1</h3>');

    // Handle tables - look for pipe patterns
    content = content.replace(/^\|(.*?\|)+\n\|([-:|]*?\|)+\n(\|(.*?\|)+\n)+/gm, function (match) {
        const lines = match.trim().split('\n');
        let tableHTML = '<table class="markdown-table">\n<thead>\n<tr>\n';

        // Extract headers from the first line
        const headers = lines[0].split('|').slice(1, -1);
        headers.forEach(header => {
            tableHTML += `<th>${header.trim()}</th>\n`;
        });
        tableHTML += '</tr>\n</thead>\n<tbody>\n';

        // Skip the header and separator lines (0 and 1)
        for (let i = 2; i < lines.length; i++) {
            const cells = lines[i].split('|').slice(1, -1);
            if (cells.length > 0 && lines[i].trim() !== '') {
                tableHTML += '<tr>\n';
                cells.forEach(cell => {
                    tableHTML += `<td>${cell.trim()}</td>\n`;
                });
                tableHTML += '</tr>\n';
            }
        }

        tableHTML += '</tbody>\n</table>';
        return tableHTML;
    });

    // Handle list items with asterisks at the beginning of lines
    // Look for patterns like "*   *text*" or "*   text"
    content = content.replace(/(^\*\s{3}.*?$\n?)+/gm, function (match) {
        const listItems = match.split('\n').filter(Boolean).map(item => {
            // Get text after the asterisk and spaces
            let itemText = item.substring(4).trim();
            return '<li>' + itemText + '</li>';
        }).join('');

        return '<ul>' + listItems + '</ul>';
    });

    // Unordered Lists with hyphens (- items)
    content = content.replace(/(^- .*?$\n?)+/gm, function (match) {
        const listItems = match.split('\n').filter(Boolean).map(item => {
            return '<li>' + item.substring(2) + '</li>'; // Remove the "- " prefix
        }).join('');

        return '<ul>' + listItems + '</ul>';
    });

    // Standard Unordered Lists with asterisks (* items)
    content = content.replace(/(^\* .*?$\n?)+/gm, function (match) {
        const listItems = match.split('\n').filter(Boolean).map(item => {
            return '<li>' + item.substring(2) + '</li>'; // Remove the "* " prefix
        }).join('');

        return '<ul>' + listItems + '</ul>';
    });

    // Ordered Lists (1. 2. 3. items)
    content = content.replace(/(^\d+\. .*?$\n?)+/gm, function (match) {
        const listItems = match.split('\n').filter(Boolean).map(item => {
            // Remove the "X. " prefix by finding the position after the first period and space
            const prefixEndPos = item.indexOf('. ') + 2;
            return '<li>' + item.substring(prefixEndPos) + '</li>';
        }).join('');

        return '<ol>' + listItems + '</ol>';
    });

    // Now handle italic formatting (*text*) after processing lists
    content = content.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

    // Paragraphs
    content = content.replace(/(?:\r\n|\r|\n){2,}/g, '</p><p>');
    content = '<p>' + content + '</p>';

    contentEl.innerHTML = content;



    // const avatar = document.createElement('div');
    // avatar.className = `user avatar`;
    // avatar.innerHTML = `  <img src="./icon/boy-avatar.png" width="200px" />`
    // messageEl.appendChild(avatar);
    
    messageEl.appendChild(contentEl);
    return messageEl;
}