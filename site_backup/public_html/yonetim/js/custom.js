jQuery(document).ready(function() {

   "use strict";

   // Tooltip
   jQuery('.tooltips').tooltip({ container: 'body'});

   // Popover
   jQuery('.popovers').popover();

   // Show panel buttons when hovering panel heading
   jQuery('.panel-heading').hover(function() {
      jQuery(this).find('.panel-btns').fadeIn('fast');
   }, function() {
      jQuery(this).find('.panel-btns').fadeOut('fast');
   });

   // Close Panel
   jQuery('.panel .panel-close').click(function() {
      jQuery(this).closest('.panel').fadeOut(200);
      return false;
   });

   // Minimize Panel
   jQuery('.panel .panel-minimize').click(function(){
      var t = jQuery(this);
      var p = t.closest('.panel');
      if(!jQuery(this).hasClass('maximize')) {
         p.find('.panel-body, .panel-footer').slideUp(200);
         t.addClass('maximize');
         t.find('i').removeClass('fa-minus').addClass('fa-plus');
         jQuery(this).attr('data-original-title','Maximize Panel').tooltip();
      } else {
         p.find('.panel-body, .panel-footer').slideDown(200);
         t.removeClass('maximize');
         t.find('i').removeClass('fa-plus').addClass('fa-minus');
         jQuery(this).attr('data-original-title','Minimize Panel').tooltip();
      }
      return false;
   });

   jQuery('.leftpanel .nav .parent > a').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var coll = jQuery(this).parents('.collapsed').length;
      var $parent = jQuery(this).parent('li');
      var $child = $parent.find('.children');

      if (!coll) {
         // Animasyon devam ediyorsa işlem yapma
         if ($child.is(':animated')) {
            return false;
         }

         // Diğer açık menüleri kapat
         jQuery('.leftpanel .nav .parent-focus').not($parent).each(function() {
            var $otherChild = jQuery(this).find('.children');
            if ($otherChild.is(':visible') && !$otherChild.is(':animated')) {
               $otherChild.slideUp(200, function() {
                  jQuery(this).parent().removeClass('parent-focus');
               });
            }
         });

         // Mevcut menüyü aç/kapat
         if(!$child.is(':visible')) {
            // CSS'in display: block yapmasını engelle
            $parent.addClass('parent-focus');
            $child.slideDown(200, function() {
               // Animasyon tamamlandıktan sonra class'ı koru
            });
         } else {
            $child.slideUp(200, function() {
               $parent.removeClass('parent-focus');
            });
         }
      }
      return false;
   });


   // Menu Toggle
   jQuery('.menu-collapse').click(function() {
      if (!$('body').hasClass('hidden-left')) {
         if ($('.headerwrapper').hasClass('collapsed')) {
            $('.headerwrapper, .mainwrapper').removeClass('collapsed');
         } else {
            $('.headerwrapper, .mainwrapper').addClass('collapsed');
            $('.children').hide(); // hide sub-menu if leave open
         }
      } else {
         if (!$('body').hasClass('show-left')) {
            $('body').addClass('show-left');
         } else {
            $('body').removeClass('show-left');
         }
      }
      return false;
   });

   // Add class nav-hover to menu. Useful for viewing sub-menu
   // Sadece collapsed menüde hover kullan
   jQuery('.leftpanel .nav li.parent').hover(function(){
      if (jQuery('.mainwrapper').hasClass('collapsed')) {
         jQuery(this).addClass('nav-hover');
      }
   }, function(){
      if (jQuery('.mainwrapper').hasClass('collapsed')) {
         jQuery(this).removeClass('nav-hover');
      }
   });

   // For Media Queries
   jQuery(window).resize(function() {
      hideMenu();
   });

   hideMenu(); // for loading/refreshing the page
   function hideMenu() {

      if($('.header-right').css('position') == 'relative') {
         $('body').addClass('hidden-left');
         $('.headerwrapper, .mainwrapper').removeClass('collapsed');
      } else {
         $('body').removeClass('hidden-left');
      }

      // Seach form move to left
      if ($(window).width() <= 360) {
         if ($('.leftpanel .form-search').length == 0) {
            $('.form-search').insertAfter($('.profile-left'));
         }
      } else {
         if ($('.header-right .form-search').length == 0) {
            $('.form-search').insertBefore($('.btn-group-notification'));
         }
      }
   }

   collapsedMenu(); // for loading/refreshing the page
   function collapsedMenu() {

      if($('.logo').css('position') == 'relative') {
         $('.headerwrapper, .mainwrapper').addClass('collapsed');
      } else {
         $('.headerwrapper, .mainwrapper').removeClass('collapsed');
      }
   }

});


 
