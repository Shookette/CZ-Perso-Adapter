"format cjs";

var wrap = require('word-wrap');
var map = require('lodash.map');
var longest = require('longest');
var rightPad = require('right-pad');

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function (options) {

  var types = options.types;

  var length = longest(Object.keys(types)).length + 1;
  var choices = map(types, function (type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key
    };
  });

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {
      console.log('\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');

      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Select the type of change that you\'re committing:',
          choices: choices
        }, {
          type: 'input',
          name: 'scope',
          message: 'Refers the BC/ANO number (only for BC/ANO types):\n'
        }, {
          type: 'input',
          name: 'subject',
          message: 'Write the title of the commit:\n'
        }, {
          type: 'input',
          name: 'body',
          message: 'Provide the description of the change:\n'
        }, {
          type: 'input',
          name: 'breaking',
          message: 'List any breaking changes:\n'
        }, {
          type: 'input',
          name: 'times',
          message: 'Time spent on this commit:\n'
        }
      ]).then(function(answers) {

        var maxLineWidth = 100;

        var wrapOptions = {
          trim: true,
          newline: '\n',
          indent:'',
          width: maxLineWidth
        };

        // parentheses are only needed when a scope is present
        var scope = answers.scope.trim() || '';

        var finalScope = '';
        if (answers.type === 'BC' || answers.type === 'ANO') {
          finalScope = '[' + answers.type + '-' + scope + ']';
        } else {
          if (scope !== undefined && scope !== null && scope !== '') {
            finalScope = '[' + answers.type + ' ' + scope + ']';
          } else {
            finalScope = '[' + answers.type + ']';
          }
        }

        // Hard limit this line
        var head = (finalScope + answers.subject.trim()).slice(0, maxLineWidth);

        // Wrap these lines at 100 characters
        var body = wrap(answers.body, wrapOptions);

        // Apply breaking change prefix, removing it if already present
        var breaking = answers.breaking.trim();
        breaking = breaking ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '') : '';
        breaking = wrap(breaking, wrapOptions);

        var time = wrap(answers.times, wrapOptions);
        // Add time spent prefix text before the brut result
        time = time ? 'Time spent : ' + time : '';

        var footer = filter([ breaking, time ]).join('\n\n');

        commit(head + '\n\n' + body + '\n\n' + footer);
      });
    }
  };
};
