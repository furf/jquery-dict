(function ($) {

  var reToken = /(\\)?\$(\d+)/g,
      dicts = {};

  $.dict = function (code, namespace, dictionary) {

    var codeParts = code.split('-'),
        language  = codeParts[0].toLowerCase(),
        locale    = codeParts[1],
        d, dict, ns;

    code = locale ? language + '-' + locale.toUpperCase() : language;

    if (!dictionary && typeof namespace !== 'string') {
      dictionary = namespace;
      namespace  = undefined;
    }
    
    if (dictionary) {

      d = (locale ? code : language) + (namespace ? '.' + namespace : '');
      dicts[d] = $.extend(dicts[d], dictionary);

    } else {

      d = [{}];
      
      dict = dicts[language];
      dict && d.push(dict);
      
      locale && (dict = dicts[code]) && d.push(dict);
      
      if (namespace) {

        ns = namespace.split('.');
        namespace  = '';
        
        while (ns.length) {

          namespace += '.' + ns.shift();

          (dict = dicts[language + namespace]) && d.push(dict);
          locale && (dict = dicts[code + namespace]) && d.push(dict);
        }
      }

      d = $.extend.apply(null, d);

      return function _ (key) {

        var args = arguments,
            str = d[key] || key;

       return ~str.indexOf('$') ?
          str.replace(reToken, function (m, s, d) {
            return s ? '$' + d : args[d];
          }) : str;

      };
    }
  };

})(jQuery);