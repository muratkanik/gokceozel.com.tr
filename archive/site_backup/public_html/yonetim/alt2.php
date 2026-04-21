    </div><!-- End p-4 Content -->
</div><!-- End Main Content -->

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- Legacy Scripts Support (if needed for older pages not yet refactored) -->
<script src="js/jquery.dataTables.min.js"></script>
<script src="js/dataTables.bootstrap.js"></script>
<script src="js/select2.min.js"></script>

<!-- Admin Custom Scripts -->
<script src="assets/js/admin.js"></script>

<script>
    // Initialize DataTables if present
    $(document).ready(function() {
        if ($('#basicTable').length) {
            $('#basicTable').DataTable({
                responsive: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/tr.json"
                }
            });
        }
    });
</script>

<?php $baglan = null; ?>
</body>
</html>
