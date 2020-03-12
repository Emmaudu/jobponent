$(document).ready(function () {
    $(window).scroll(function () {
        var $nav = $('.main-navbar');
        var $subNav = $('.subnav');
        var scrollBehavior = $(this).scrollTop() > $nav.height();

        if ($subNav.length) {
            $nav.toggleClass('d-none', scrollBehavior);
            $subNav.toggleClass('navbar-fixed-top fixed-top bg-white', scrollBehavior);
        } else {
            $nav.toggleClass('navbar-fixed-top fixed-top bg-white', scrollBehavior);
        }
    });

    $('.navbar-mobile-toggle').click(function () {
        var $nav = $('.navbar-mobile');

        $nav.toggleClass('navbar-mobile--open');
    });

    var howItWorksInterval = null;

    // Setup basic carousel for "How it works"
    (function () {
        var steps = ['create', 'setup', 'manage', 'pay'];
        
        // Start from second item, first item is visible by default.
        var currentStep = 2;

        var interval = 10000;

        setTimeout(function () {
            howItWorksInterval = setInterval(function () {                
                showHowItWorksStep($('[data-action="'+ steps[(currentStep - 1)] +'"]'));

                currentStep += 1;

                if (currentStep > steps.length) {
                    currentStep = 1;
                }
            }, interval);
        }, interval);
    })();

    var $howItWorksImg = $('.how-it-works__image');

    var $howItWorksDescription = $('.how-it-works__description');

    var $howItWorksImageMap = {
        create: {
            image: '/images/create-account.png'
        },
        setup: {
            image: '/images/setup-plan.png'
        },
        manage: {
            image: '/images/manage-plan.png'
        },
        pay: {
            image: '/images/pay-fees.png'
        },
    }

    $('.how-it-works__action').click(function () {
        showHowItWorksStep($(this));

        if (howItWorksInterval) {
            clearInterval(howItWorksInterval);
        }
    });

    function showHowItWorksStep($element) {
        if ($element.hasClass('active')) {
            return;
        }

        $('.how-it-works__action').removeClass('active');

        $element.addClass('active');

        var action = $element.data('action');

        $howItWorksImg.fadeOut(400, function () {
            var data = $howItWorksImageMap[action];

            $(this).attr('src', data.image);

            $howItWorksDescription.removeClass('d-block').addClass('d-none');

            $('#' + action + '-description').removeClass('d-none').addClass('d-block');

            $(this).fadeIn(400);
        });   
    }

    var testimonials = [
        {
            image: 'https://files.slack.com/files-pri/T03BVMTM3-FPU298XC6/dsc_7241.jpg',
            text: "&quot;Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.&quot;",
            name: 'Angela Essien'
        },
        {
            image: 'https://netstorage-legit.akamaized.net/images/59d3a1544c7e5f77.jpg?imwidth=900',
            text: "&quot;Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.&quot;",
            name: 'Tiwa Savage'
        },
    ];

    var currentTestimonialIndex = 0;

    var $testimonialUserImageElement = $('#testimonial-user-image');
    var $testimonialUserContentElement = $('#testimonial-user-content');
    var $testimonialUserNameElement = $('#testimonial-user-name');
    var $testimonialUserTextElement = $('#testimonial-user-text');

    $('.carousel-control-right, .carousel-control-left').click(function () {
        if ($(this).hasClass('carousel-control-right')) {
            currentTestimonialIndex = currentTestimonialIndex + 1 >= testimonials.length ? 0 : currentTestimonialIndex + 1;
        } else {
            currentTestimonialIndex = currentTestimonialIndex - 1 < 0 ? testimonials.length - 1 : currentTestimonialIndex - 1;
        }

        $testimonialUserImageElement.fadeOut(300, function () {
            $(this).attr('src', testimonials[currentTestimonialIndex].image);

            $(this).fadeIn(300);
        });

        $testimonialUserContentElement.fadeOut(400, function () {
            $testimonialUserNameElement.html(testimonials[currentTestimonialIndex].name);
            $testimonialUserTextElement.html(testimonials[currentTestimonialIndex].text);

            $(this).fadeIn(400);
        })
    });
});