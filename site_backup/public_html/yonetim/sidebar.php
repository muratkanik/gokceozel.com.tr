<!-- Sidebar Component for Admin Panel -->
<style>
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: var(--sidebar-width, 260px);
        background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
        color: white;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }

    .sidebar-logo {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        font-size: 1.25rem;
        font-weight: 700;
    }

    .sidebar-menu {
        padding: 1rem 0;
    }

    .sidebar-menu-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        transition: all 0.2s;
    }

    .sidebar-menu-item:hover,
    .sidebar-menu-item.active {
        background: rgba(255,255,255,0.1);
        color: white;
    }

    .sidebar-menu-item i {
        width: 24px;
        margin-right: 0.75rem;
        font-size: 1.25rem;
    }

    .sidebar-footer {
        position: absolute;
        bottom: 1rem;
        left: 0;
        right: 0;
        padding: 0 1.5rem;
    }

    .sidebar-user-box {
        padding: 1rem;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
    }
</style>

<div class="sidebar">
    <div class="sidebar-logo">
        <i class="bi bi-hospital"></i> Dr. Gökçe CMS
    </div>

    <div class="sidebar-menu">
        <a href="dashboard.php" class="sidebar-menu-item <?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'active' : ''; ?>">
            <i class="bi bi-speedometer2"></i>
            Dashboard
        </a>
        <a href="content-list.php" class="sidebar-menu-item <?php echo basename($_SERVER['PHP_SELF']) == 'content-list.php' ? 'active' : ''; ?>">
            <i class="bi bi-file-text"></i>
            İçerik Yönetimi
        </a>
        <a href="content-edit.php?new=1" class="sidebar-menu-item">
            <i class="bi bi-plus-circle"></i>
            Yeni İçerik
        </a>
        <a href="categories.php" class="sidebar-menu-item <?php echo basename($_SERVER['PHP_SELF']) == 'categories.php' ? 'active' : ''; ?>">
            <i class="bi bi-folder"></i>
            Kategoriler
        </a>
        <a href="seo-dashboard.php" class="sidebar-menu-item <?php echo basename($_SERVER['PHP_SELF']) == 'seo-dashboard.php' ? 'active' : ''; ?>">
            <i class="bi bi-graph-up"></i>
            SEO Skorları
        </a>
        <a href="media-library.php" class="sidebar-menu-item <?php echo basename($_SERVER['PHP_SELF']) == 'media-library.php' ? 'active' : ''; ?>">
            <i class="bi bi-images"></i>
            Medya Kütüphanesi
        </a>
        <a href="translations.php" class="sidebar-menu-item <?php echo basename($_SERVER['PHP_SELF']) == 'translations.php' ? 'active' : ''; ?>">
            <i class="bi bi-translate"></i>
            Çeviriler
        </a>
        <a href="randevu_listesi.php" class="sidebar-menu-item <?php echo basename($_SERVER['PHP_SELF']) == 'randevu_listesi.php' ? 'active' : ''; ?>">
            <i class="bi bi-calendar-check"></i>
            Randevular
        </a>
        <a href="settings.php" class="sidebar-menu-item <?php echo basename($_SERVER['PHP_SELF']) == 'settings.php' ? 'active' : ''; ?>">
            <i class="bi bi-gear"></i>
            Ayarlar
        </a>
    </div>

    <div class="sidebar-footer">
        <div class="sidebar-user-box">
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
                <i class="bi bi-person-circle"></i> <?php echo $_SESSION['username'] ?? 'Admin'; ?>
            </div>
            <a href="logout.php" style="color: rgba(255,255,255,0.7); font-size: 0.875rem; text-decoration: none;">
                <i class="bi bi-box-arrow-right"></i> Çıkış Yap
            </a>
        </div>
    </div>
</div>
