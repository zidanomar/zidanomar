export class UIManager {
    private sidebar: HTMLElement | null;
    private sidebarOverlay: HTMLElement | null;
    private sidebarToggle: HTMLButtonElement | null;

    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.sidebarOverlay = null;
        this.sidebarToggle = null;
        
        this.init();
    }

    private init(): void {
        this.generateLineNumbers();
        this.setupFolderToggle();
        this.setupFileClick();
        this.setupSidebarToggle();
        this.setupCopyButton();
    }

    private generateLineNumbers(): void {
        const codeContent = document.getElementById('codeContent');
        const lineNumbers = document.getElementById('lineNumbers');
        
        if (!codeContent || !lineNumbers) return;
        
        const text = codeContent.textContent || codeContent.innerText;
        const lines = text.split('\n');
        const lineCount = lines.length;
        
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = i.toString();
            lineDiv.className = 'line-number';
            lineNumbers.appendChild(lineDiv);
        }
    }

    private setupFolderToggle(): void {
        document.querySelectorAll('.folder-name').forEach(folder => {
            folder.addEventListener('click', () => {
                const parent = folder.parentElement;
                const arrow = folder.querySelector('.arrow');
                const content = parent?.querySelector('.folder-content') as HTMLElement;
                
                if (!parent || !arrow || !content) return;
                
                if (parent.classList.contains('open')) {
                    parent.classList.remove('open');
                    arrow.textContent = '▶';
                    content.style.display = 'none';
                } else {
                    parent.classList.add('open');
                    arrow.textContent = '▼';
                    content.style.display = 'block';
                }
            });
        });
    }

    private setupFileClick(): void {
        document.querySelectorAll('.file').forEach(file => {
            file.addEventListener('click', () => {
                document.querySelectorAll('.file').forEach(f => f.classList.remove('active'));
                file.classList.add('active');
                
                if (this.sidebar?.classList.contains('open')) {
                    this.sidebar.classList.remove('open');
                    this.sidebarOverlay?.classList.remove('active');
                }
            });
        });
    }

    private setupSidebarToggle(): void {
        if (!this.sidebar) return;
        
        this.sidebarToggle = document.createElement('button');
        this.sidebarToggle.className = 'sidebar-toggle';
        this.sidebarToggle.innerHTML = '☰';
        this.sidebarToggle.setAttribute('aria-label', 'Toggle Sidebar');
        
        this.sidebarOverlay = document.createElement('div');
        this.sidebarOverlay.className = 'sidebar-overlay';
        
        const toggleSidebar = () => {
            this.sidebar?.classList.toggle('open');
            this.sidebarOverlay?.classList.toggle('active');
        };
        
        this.sidebarToggle.addEventListener('click', toggleSidebar);
        this.sidebarOverlay.addEventListener('click', toggleSidebar);
        
        document.body.appendChild(this.sidebarToggle);
        document.body.appendChild(this.sidebarOverlay);
        
        let resizeTimer: number;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                if (window.innerWidth >= 768) {
                    this.sidebar?.classList.remove('open');
                    this.sidebarOverlay?.classList.remove('active');
                }
            }, 250);
        });
    }

    private setupCopyButton(): void {
        const codeContent = document.getElementById('codeContent');
        const editor = document.querySelector('.editor');
        
        if (!codeContent || !editor) return;
        
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '📋 Copy';
        copyBtn.style.cssText = `
            position: absolute;
            top: 70px;
            right: 20px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: var(--font-mono);
            font-size: 12px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        `;
        
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0.7';
        });
        
        copyBtn.addEventListener('click', async () => {
            const text = codeContent.textContent || '';
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.innerHTML = '✓ Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
        
        const editorElement = editor as HTMLElement;
        editorElement.style.position = 'relative';
        editor.appendChild(copyBtn);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new UIManager());
} else {
    new UIManager();
}
