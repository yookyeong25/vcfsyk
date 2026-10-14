/* All page interactions use jQuery. No personal data is persisted or transmitted. */
$(function () {
  var step = 1;
  var $form = $('#consultation');
  function showStep(number) {
    step = number;
    $('.form-step').prop('hidden', true).filter('[data-step="' + step + '"]').prop('hidden', false);
    $('#step-number').text('0' + step);
    $('.progress i').css('width', (step / 3 * 100) + '%');
    $('.back').prop('hidden', step === 1);
    $('#next').html(step === 3 ? '진단 입력 완료하기 <span>↗</span>' : '다음 단계로 <span>→</span>');
    $('.form-error').text('');
  }
  $('a[href^="#"]').on('click', function (event) {
    var target = $(this).attr('href');
    event.preventDefault();
    var top = target === '#' ? 0 : $(target).offset().top - 25;
    $('html, body').stop().animate({ scrollTop: top }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450);
  });
  $('.faqs button').on('click', function () {
    var expanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', String(!expanded)).find('span').text(expanded ? '+' : '−');
    $('#' + $(this).attr('aria-controls')).prop('hidden', expanded);
  });
  $('.back').on('click', function () { showStep(step - 1); });
  $('#phone').on('input', function () {
    var digits = $(this).val().replace(/\D/g, '').slice(0, 11);
    $(this).val(digits.length > 7 ? digits.slice(0, 3) + '-' + digits.slice(3, digits.length - 4) + '-' + digits.slice(-4) : digits.length > 3 ? digits.slice(0, 3) + '-' + digits.slice(3) : digits);
  });
  $form.on('submit', function (event) {
    event.preventDefault();
    var error = '';
    if (step === 1 && !$('input[name="debt"]:checked').length) error = '총 채무액을 선택해주세요.';
    if (step === 2 && !$('input[name="income"]:checked').length) error = '소득 활동 여부를 선택해주세요.';
    if (step === 3) {
      if (!$.trim($('#name').val())) { error = '성함을 입력해주세요.'; $('#name').trigger('focus'); }
      else if (!/^01[016789]\d{7,8}$/.test($('#phone').val().replace(/\D/g, ''))) { error = '올바른 휴대전화 번호를 입력해주세요.'; $('#phone').trigger('focus'); }
      else if (!$('#consent').prop('checked')) { error = '개인정보 처리 안내를 확인하고 동의해주세요.'; $('#consent').trigger('focus'); }
    }
    if (error) { $('.form-error').text(error); return; }
    if (step < 3) { showStep(step + 1); $('.form-step:not([hidden]) input').first().trigger('focus'); }
    else { $form[0].reset(); $form.prop('hidden', true); $('#success').prop('hidden', false); updateSticky(); }
  });
  $('#restart').on('click', function () { $('#success').prop('hidden', true); $form.prop('hidden', false); showStep(1); updateSticky(); });
  $('#privacy-open, .privacy-link').on('click', function () { $('#privacy-dialog')[0].showModal(); });
  $('#privacy-close').on('click', function () { $('#privacy-dialog')[0].close(); });
  $('#privacy-dialog').on('click', function (event) { if (event.target === this) { var rect = this.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) this.close(); } });
  function updateSticky() {
    var rect = $('#diagnosis')[0].getBoundingClientRect();
    $('.sticky-cta').toggleClass('is-hidden', rect.top < window.innerHeight - 80 && rect.bottom > 0);
  }
  $(window).on('scroll resize', updateSticky);
  updateSticky();
});
