$(document).on('pageinit', '#translate-it-app', function() {
	// application control options
	var options = {
		activeTranslationType: 'all'
	};

	// remove clear button from search input
	$('#search-query-block .ui-input-clear').remove();

	// test dictionary
	var translationsEN_RU = {
		'table': [
			{ type: 'word', translation: 'таблица' },
			{ type: 'word', translation: 'стол' },
			{ type: 'word', translation: 'расписание' },
			{ type: 'term', translation: 'табель' },
			{ type: 'term', translation: 'рольганг' }
		],
		'browser': [
			{ type: 'term', translation: 'браузер' },
			{ type: 'term', translation: 'программа просмотра' },
			{ type: 'word', translation: 'посетитель, рассматривающий товары' }
		],
		'checkbox': [
			{ type: 'word', translation: 'флажок' },
			{ type: 'term', translation: 'чек-бокс' }
		]
	};

	var translationsRU_EN = {
		'таблица': [
			{ type: 'word', translation: 'table' },
			{ type: 'word', translation: 'chart' },
			{ type: 'word', translation: 'schedule' },
			{ type: 'term', translation: 'spreadsheet' },
			{ type: 'term', translation: 'array' }
		],
		'браузер': [
			{ type: 'term', translation: 'browser' }
		],
		'флажок': [
			{ type: 'word', translation: 'flag' },
			{ type: 'term', translation: 'checkbox' }
		]
	};

	// handle translation activities
	$('#search-translations').submit(function(e){	
		e.preventDefault();
		$('#search-query').blur();

		var $messageContainer = $('p.message-cont')
			.empty()
			.hide();

		var languageFrom = $('#language-from select').val(),
			languageTo   = $('#language-to select').val();

		var dictionary = languageFrom === 'en' ? translationsEN_RU : translationsRU_EN;
		var query = $('#search-query').val();

		var result = [];

		if (typeof dictionary[query] !== 'undefined') {
			result = dictionary[query];
		}

		var $translationsList = $('ul#results').empty();
		var $translationsListReplacement = $('<ul id="results"></ul>');

		if (result.length > 0) {
			$.each(result, function(i, val) {
				var $listItem = $('<li></li>')
					.html(val.translation)
					.attr('data-translation-type', val.type)
					.data('translation-type', val.type)
					.appendTo($translationsListReplacement);
			});

			$translationsList.replaceWith($translationsListReplacement);
			$('ul#results').listview();

			switchTranslationType(options.activeTranslationType);
		} else {
			$messageContainer
				.html('No translations found.')
				.show();
		}
	});
	
	// switch translation type
	$(document).on('vclick', 'nav.nav-switch-view a', function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		switchTranslationType($(this).attr('data-view-translation-type'));
	});

	function switchTranslationType(switchToType) {
		options.activeTranslationType = switchToType;
		
		var $translationsList = $('ul#results');
		var $messageContainer = $('p.message-cont');

		if ($translationsList.children().length > 0) {
			if (switchToType !== 'all') {
				var message;
				if (switchToType === 'word') {
					message = 'No translations of type "Word" found.';
				} else {
					message = 'No translations of type "Term" found.';
				}
				$translationsList.find('li').hide();
				var $filteredItems = $translationsList.find('li[data-translation-type="' + switchToType + '"]');

				if ($filteredItems.length > 0) {
					$messageContainer.hide();
					$filteredItems.show();
				} else {
					$messageContainer
						.html(message)
						.show();
				}
			} else {
				$messageContainer.hide();
				$translationsList.find('li').show();
			}
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