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
        this.setupFolderToggle();
        this.setupFileClick();
        this.setupSidebarToggle();
        this.setupCopyButton();
        this.setupScrollSpy();
    }

    private setupScrollSpy(): void {
        const codeContent = document.getElementById('codeContent');
        const sectionLinks = document.querySelectorAll('.section-link');
        
        if (!codeContent || sectionLinks.length === 0) return;

        // Smooth scroll to section when clicking sidebar links
        sectionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                if (!targetId) return;
                
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    // Update active state immediately
                    sectionLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Spy on scroll to update active link
        // Use IntersectionObserver for better performance
        const observerOptions = {
            root: codeContent,
            rootMargin: '0px',
            threshold: 0.2 // Trigger when 20% of the section is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    // Find corresponding link
                    const activeLink = document.querySelector(`.section-link[data-target="${id}"]`);
                    
                    if (activeLink) {
                        // Remove active class from all links
                        sectionLinks.forEach(l => l.classList.remove('active'));
                        // Add active class to current link
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.code-section').forEach(section => {
            observer.observe(section);
        });
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
