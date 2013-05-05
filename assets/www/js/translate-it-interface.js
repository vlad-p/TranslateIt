$(document).on('pageinit', '#translate-it-app', function() {
	/*$.ajax({
		type: 'GET',
		url: 'http://translate.google.com/translate_a/t?client=t&sl=en&tl=ru&q=table',
		dataType: 'jsonp',
		success: function(result, textStatus, jqXHR) {
			console.log(arguments);
		},
		complete: function(jqXHR, textStatus) {
			console.log(textStatus);
		}
	});*/

	// application control options
	var options = {
		activeTranslationType: 'words'
	};

	// remove clear button from search input
	$('#search-query-block .ui-input-clear').remove();

	// handle translation activities
	$('#search-translations').submit(function(e){	
		e.preventDefault();
		$('#search-query').blur();

		var $messageContainer = $('p.message-cont')
			.empty()
			.hide();

		var languageFrom = $('#language-from select').val(),
			languageTo   = $('#language-to select').val();

		var textToTranslate = $('#search-query').val();

		if (languageFrom === languageTo) {
			var $translationsList = $('ul#results').empty();
			var $translationsListReplacement = $('<ul id="results"></ul>');
			var $listItem = $('<li></li>')
								.html(textToTranslate)
								.appendTo($translationsListReplacement);
			$translationsList.replaceWith($translationsListReplacement);
			$('ul#results').listview();
		} else {
			var pageBackground = $('#translate-it-app').css('background');

			if (options.activeTranslationType === 'words') {
				$.ajax({
					type: 'GET',
					url: 'http://translateit.hostei.com/ajax/test_translation_service.php',
					data: {
						languageFrom: languageFrom,
						languageTo: languageTo,
						textToTranslate: textToTranslate,
						maxTranslations: 10
					},
					dataType:'jsonp',
					beforeSend: function() {
						$('ul#results').empty();
						$('#translate-it-app')
							.css('background','url("images/ajax-loader.gif") no-repeat center');
					},
					success: function(result) {
						// console.log(result);

						$('#translate-it-app')
							.css('background', pageBackground);

						var $translationsList = $('ul#results').empty();
						var $translationsListReplacement = $('<ul id="results"></ul>');
						
						if (result.Translations.length > 0) {
							$.each(result.Translations, function() {
								var translation = this.TranslatedText.toLowerCase();
								translation = translation.replace(/[;\\\/:*?\"<>|&\'\.]/g, '')
								var $listItem = $('<li></li>')
													.html(translation)
													.appendTo($translationsListReplacement);
							});

							$translationsList.replaceWith($translationsListReplacement);
							$('ul#results').listview();
						} else {
							$messageContainer
								.html('No translations found.')
								.show();
						}
					}
				});
			} else if (options.activeTranslationType === 'phrases') {
				$.ajax({
					type: 'GET',
					url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
					data: {
						key: 'trnsl.1.1.20130502T083517Z.364dbfbe6df7c456.b87249b5fc8661ebddbcb8a09eea56c995f868a8',
						lang: languageFrom + '-' + languageTo,
						text: textToTranslate
					},
					dataType: 'json',
					beforeSend: function() {
						$('ul#results').empty();
						$('#translate-it-app')
							.css('background','url("images/ajax-loader.gif") no-repeat center');
					},
					success: function(result) {
						$('#translate-it-app')
							.css('background', pageBackground);
						
						if (result.text.length > 0) {
							var $translationsList = $('ul#results').empty();
							var $translationsListReplacement = $('<ul id="results"></ul>');
							var $listItem = $('<li></li>')
												.html(result.text[0])
												.appendTo($translationsListReplacement);
							$translationsList.replaceWith($translationsListReplacement);
							$('ul#results').listview();
						} else {
							$messageContainer
								.html('No translations found.')
								.show();
						}
					}
				});
			}
		}
	});
	
	// switch translation type
	$(document).on('vclick', 'nav.nav-switch-view a', function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		switchTranslationType($(this).attr('data-view-translation-type'));
	});

	function switchTranslationType(switchToType) {
		if (switchToType !== options.activeTranslationType) {
			options.activeTranslationType = switchToType;
			$('#search-query').val('');
			$('ul#results').empty();
		}
	}

	// switch languages
	$('#language-switch .language-switch-button').click(function() {
		var $languageFrom = $('#language-from select'),
			$languageTo   = $('#language-to select');

		var languageFromValue = $languageFrom.val(),
			languageToValue   = $languageTo.val();
		
		$languageFrom.find('option').removeAttr('selected');
		$languageFrom.val(languageToValue);
		$languageFrom.selectmenu('refresh', true);

		$languageTo.find('option').removeAttr('selected');
		$languageTo.val(languageFromValue);		
		$languageTo.selectmenu('refresh', true);
	});
});