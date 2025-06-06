// Setup editors
function setupInfoArea(id) {
  const e = ace.edit(id);
  e.setShowPrintMargin(false);
  e.setOptions({
    readOnly: true,
    highlightActiveLine: false,
    highlightGutterLine: false
  })
  e.renderer.$cursorLayer.element.style.opacity=0;
  return e;
}

function setupEditorArea(id, lsKey) {
  const e = ace.edit(id);
  e.setShowPrintMargin(false);
  e.setValue(localStorage.getItem(lsKey) || '');
  e.moveCursorTo(0, 0);
  return e;
}

let userContentHasChanged = false;
let grammarContentHasChanged = false;
let inputContentHasChanged = false;
function grammarOnChange(delta) {
	if(!grammarContentHasChanged) {
		grammarContentHasChanged = true;
		userContentHasChanged = true;
	}
}
function inputOnChange(delta) {
	if(!inputContentHasChanged) {
		inputContentHasChanged = true;
		userContentHasChanged = true;
	}
}

//Should be in sync with rex_playground.cpp
//enum E_RexOptions {
const RO_rex = 0;
const RO_ll = (1 << 0);
const RO_lalr = (1 << 1);
const RO_lr = (1 << 2);
const RO_glr = (1 << 3);
const RO_glalr = (1 << 4);
const RO_backtrack = (1 << 5);
const RO_faster = (1 << 6);
const RO_smaller = (1 << 7);
const RO_tree = (1 << 8);
const RO_main = (1 << 9);
const RO_trace = (1 << 10);
const RO_performance = (1 << 11);
const RO_cpp = (1 << 12);
const RO_csharp = (1 << 13);
const RO_go = (1 << 14);
const RO_haxe = (1 << 15);
const RO_java = (1 << 16);
const RO_javascript = (1 << 17);
const RO_python = (1 << 18);
const RO_scala = (1 << 19);
const RO_typescript = (1 << 20);
const RO_xquery = (1 << 21);
const RO_xslt = (1 << 22);
const RO_xml = (1 << 23);
const RO_saxon = (1 << 24);
const RO_basex = (1 << 25);
const RO_asi = (1 << 26);
const RO_a = (1 << 27);
//};


const grammarEditor = setupEditorArea("grammar-editor", "grammarText");
grammarEditor.on("change", grammarOnChange);
grammarEditor.getSession().setMode("ace/mode/yaml");
const codeEditor = setupEditorArea("code-editor", "codeText");
codeEditor.on("change", inputOnChange);
userContentHasChanged = localStorage.getItem("userContentHasChanged");

const codeCode = setupEditorArea("code-code");
const codeOutput = setupInfoArea("code-output");

onbeforeunload= function(event) { updateLocalStorage(); };

const sampleList = [
	//title, grammar, input, input ace syntax
	["antlr parser", "Java.ebnf", "test.java", "ace/mode/java"],
	//["EcmaScript parser", "EcmaScript.ebnf", "test.java", "ace/mode/java"],
	["Java parser", "Java.ebnf", "test.java", "ace/mode/java"],
	["Java-18 parser", "java_18.ebnf", "test.java", "ace/mode/java"],
	//["JSONiq parser", "JSONiqParser.ebnf", "test.java", "ace/mode/java"],
	["rex parser", "EbnfParser_naked.ebnf", "EbnfParser_naked.ebnf", "ace/mode/text"],
	["turtle parser", "turtle.ebnf", "EbnfParser_naked.ebnf", "ace/mode/text"],
];

function load_example(self) {
  if(userContentHasChanged)
  {
	let ok = confirm("Your changes will be lost !\nIf the changes you've made are important save then before proceed.\nCopy and paste to your prefered editor and save it.\nEither OK or Cancel.");
	if(!ok) return false;
  }
  let base_url = "./grammars/"
  if(self.selectedIndex > 0) {
      let sample_to_use = sampleList[self.selectedIndex-1];
      $.get(base_url + sample_to_use[1], function( data ) {
        grammarEditor.setValue( data );
	grammarContentHasChanged = false;
	userContentHasChanged = false;
      });
      $.get(base_url + sample_to_use[2], function( data ) {
        codeEditor.setValue( data );
	codeEditor.getSession().setMode(sample_to_use[3]);
	inputContentHasChanged = false;
	userContentHasChanged = false;
      });
  }
}

$('#opt-mode').val(localStorage.getItem('optimizationMode') || 'all');
$('#start-rule').val(localStorage.getItem('startRule') || '');
$('#parse').prop('disabled', $('#auto-refresh').prop('checked'));

// Parse
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nl2br(str) {
  return str.replace(/\n/g, '<br>\n')
}

function textToErrors(str) {
  let errors = [];
  var regExp = /([^\n]+?)\n/g, match;
  while (match = regExp.exec(str)) {
    let msg = match[1];
    let line_col = msg.match(/error:(\d+):(\d+):/);
    if (line_col) {
      errors.push({"ln": line_col[1], "col":line_col[2], "msg": msg});
    } else {
      errors.push({"msg": msg});
    }
  }
  return errors;
}

function generateErrorListHTML(errors) {
  let html = '<ul>';

  html += $.map(errors, function (x) {
    if (x.ln > 0) {
      return '<li data-ln="' + x.ln + '" data-col="' + x.col +
        '"><span>' + escapeHtml(x.msg) + '</span></li>';
    } else {
      return '<li><span>' + escapeHtml(x.msg) + '</span></li>';
    }
  }).join('');

  html += '<ul>';

  return html;
}

function updateLocalStorage() {
  if(grammarContentHasChanged || inputContentHasChanged)
  {
    localStorage.setItem('grammarText', grammarEditor.getValue());
    localStorage.setItem('codeText', codeEditor.getValue());
    grammarContentHasChanged = false;
    inputContentHasChanged = false;
    localStorage.setItem('optimizationMode', $('#opt-mode').val());
    localStorage.setItem('startRule', $('#start-rule').val());
  }
}

// convert a Javascript string to a C string
function jstr2C(s) {
  var size = lengthBytesUTF8(s) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(s, HEAP8, ret, size);
  return ret;
}

function run_argc_argv(jfunc, jstrings) {
  let c_strings = jstrings.map(x => jstr2C(x));

  // allocate and populate the array. adapted from https://stackoverflow.com/a/23917034
  let argc = c_strings.length;
  let c_arr = _malloc((argc + 1) * 4); // 4-bytes per pointer
  c_strings.forEach(function (x, i) {
    Module.setValue(c_arr + i * 4, x, "i32");
  });
  Module.setValue(c_arr + argc * 4, null, "i32");

  // invoke our C function
  let rc = jfunc(argc, c_arr);

  // free c_strings
  for (let i = 0; i < argc; i++)
    _free(c_strings[i]);

  // free c_arr
  _free(c_arr);

  // return
  return rc;
}

function callCustomMain(mfunc, args) {
  Module["_main"] = Module[mfunc];
  return callMain(args);
}

var parse_start_time = 0;

function parse() {
  const $grammarValidation = $('#grammar-validation');
  const $grammarInfo = $('#grammar-info');
  const grammarText = grammarEditor.getValue();

  const $codeValidation = $('#code-validation');
  const $codeInfo = $('#code-info');
  const codeText = codeEditor.getValue();

  const optimizationMode = $('#opt-mode').val();
  const startRule = $('#start-rule').val();
  const opt_code = $('#show-code').prop('checked');
  const opt_output = $('#show-output').prop('checked');

  $grammarInfo.html('');
  $grammarValidation.hide();
  $codeInfo.html('');
  $codeValidation.hide();
  codeCode.setValue('');
  codeOutput.setValue('');

  if (grammarText.length === 0) {
   return;
  }

  const mode = optimizationMode == 'all';

  $('#overlay').css({
    'z-index': '1',
    'display': 'block',
    'background-color': 'rgba(0, 0, 0, 0.1)'
  });

  outputs.compile_status = '';
  outputs.parse_status = '';
  outputs.parse_stats = '';
  outputs.parse_debug = '';
  outputs.parse_time = '';
  outputs.parse_ebnf_yacc = '';

  const grammar_fname_base = "grammar";
  const grammar_fname_ext = ".ebnf";
  const code_fname_ext = ".js";
  let grammar_fname = grammar_fname_base + grammar_fname_ext;
  if (FS.findObject(grammar_fname))
    FS.unlink(grammar_fname);
  FS.createDataFile("/", grammar_fname, grammarText, true, true, true);
  let code_fname = grammar_fname_base + code_fname_ext;
  if (FS.findObject(code_fname))
      FS.unlink(code_fname);

  window.setTimeout(() => {
    $('#overlay').css({
      'z-index': '-1',
      'display': 'none',
      'background-color': 'rgba(1, 1, 1, 1.0)'
    });
    output = "parse_status";
    let rc;
    //rc = run_argc_argv(_main, ["rex", grammar_fname, "-javascript", "-main", "-ll", "3", "-name", "ns", "-a", "ca"]);
    let cmd_line = ["rex", grammar_fname, "-javascript", "-main", "-ll", "3", "-backtrack"];
    outputs[output] += "<pre>cmd: " + cmd_line.join(" ") + "</pre>";
    rc = run_argc_argv(_main, cmd_line);
    //rex_generator(grammarText, (RO_ll | RO_main | RO_javascript), 3, "ns", "ca");

    output = "default";
    if (rc == 0) {
      $grammarValidation.removeClass('validation-invalid').show();
      $codeValidation.removeClass('validation-invalid').show();
      //$grammarInfo.html('<pre>' + FS.readdir("/") + '</pre>');
      codeCode.getSession().setMode("ace/mode/javascript");
      codeCode.setValue(FS.readFile(code_fname, { encoding: 'utf8' }));
    }

    if (outputs.parse_status.length > 0) {
      $grammarInfo.html("<pre>" + outputs.parse_status + "</pre>");
    }

  }, 0);
}

// Event handing for text editing
let timer;
function setupTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    updateLocalStorage();
    if ($('#auto-refresh').prop('checked')) {
      parse();
    }
  }, 750);
};
grammarEditor.getSession().on('change', setupTimer);
codeEditor.getSession().on('change', setupTimer);

// Event handing in the info area
function makeOnClickInInfo(editor) {
  return function () {
    const el = $(this);
    editor.navigateTo(el.data('ln') - 1, el.data('col') - 1);
    editor.scrollToLine(el.data('ln') - 1, true, false, null);
    editor.focus();

    if(el.data('gln') && el.data('gcol')) {
      grammarEditor.navigateTo(el.data('gln') - 1, el.data('gcol') - 1);
      grammarEditor.scrollToLine(el.data('gln') - 1, true, false, null);
    }
  }
};
$('#grammar-info').on('click', 'li', makeOnClickInInfo(grammarEditor));
$('#code-info').on('click', 'li', makeOnClickInInfo(codeEditor));

// Event handing in the AST optimization
$('#opt-mode').on('change', setupTimer);
$('#start-rule').on('keydown', setupTimer);
$('#parse').on('click', parse);

// Resize editors to fit their parents
function resizeEditorsToParent() {
  codeEditor.resize();
  codeEditor.renderer.updateFull();
  codeCode.resize();
  codeCode.renderer.updateFull();
  codeOutput.resize();
  codeOutput.renderer.updateFull();
}

const ShowProfile = 'show-profile';
const ShowTrace = 'show-trace';

// Show windows
function setupToolWindow(lsKeyName, buttonSel, codeSel) {
  let show = localStorage.getItem(lsKeyName) === 'true';
  $(buttonSel).prop('checked', show);
  $(codeSel).css({ 'display': show ? 'block' : 'none' });

  $(buttonSel).on('change', () => {
    show = $(buttonSel).prop('checked');
    localStorage.setItem(lsKeyName, show);
    $(codeSel).css({ 'display': show ? 'block' : 'none' });
    if(show) {
      switch(lsKeyName) {
        case ShowProfile:
             $('#' + ShowTrace).prop('checked', false);
             localStorage.setItem(ShowTrace, false);
        break;
        case ShowTrace:
             $('#' + ShowProfile).prop('checked', false);
             localStorage.setItem(ShowProfile, false);
        break;
      }
    }
    resizeEditorsToParent();
  });
}
setupToolWindow('show-code', '#show-code', '#code-code');
setupToolWindow('show-output', '#show-output', '#code-output');

// Show page
$('#main').css({
  'display': 'flex',
});

// used to collect output from C
var outputs = {
  'default': '',
  'compile_status': '',
  'parse_debug': '',
  'parse_status': '',
  'parse_stats': '',
  'parse_time': '',
  'parse_ebnf_yacc': '',
};

// current output (key in `outputs`)
var output = "default";

// results of the various stages
var result = {
  'compile': 0,
  'parse': 0,
  'ast': 0,
};

// gram_grep function: initialized when emscripten runtime loads
var rex_generator = null;

// WebAssembly
var Module = {
  // intercept stdout (print) and stderr (printErr)
  // note: text received is line based and missing final '\n'

  'print': function(text) {
    outputs[output] += text + "\n";
  },
  'printErr': function(text) {
    outputs[output] += text + "\n";
  },

  // called when emscripten runtime is initialized
  'onRuntimeInitialized': function() {
    // wrap the C `parse` function
    rex_generator = cwrap('main_playground', 'number', ['string',
	  'number', 'number', 'string', 'string']);

    // Initial parse
    if ($('#auto-refresh').prop('checked')) {
      parse();
    }
  }
};

function doFinalSettings() {
	let select_samples = document.getElementById('opt-samples');
	sampleList.map( (lang, i) => {
           let opt = document.createElement("option");
           opt.value = i; // the index
           opt.innerHTML = lang[0];
           select_samples.append(opt);
        });
}

// vim: sw=2:sts=2
