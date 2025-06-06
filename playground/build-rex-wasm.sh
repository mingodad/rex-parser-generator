#!/bin/sh

myflags="-O2 -s TOTAL_STACK=8MB"
#myflags2="-s FORCE_FILESYSTEM=1 -lnodefs.js"
main_func="_main"
output_fn="rex_playground.js"

emsdk-env em++ -o $output_fn $myflags -Wall -Wno-unused-function -pedantic \
	-s EXPORTED_FUNCTIONS=$main_func,_free,_malloc  \
	-s EXPORTED_RUNTIME_METHODS=ccall,cwrap,FS,callMain,setValue \
	-s ALLOW_MEMORY_GROWTH=1 -s NO_DISABLE_EXCEPTION_CATCHING \
	-s INVOKE_RUN=0 -s EXIT_RUNTIME=0 \
	../rex/src/main.cpp \
	../rex/src/common/CompressedMap.cpp \
	../rex/src/common/FileIO.cpp \
	../rex/src/common/Format.cpp \
	../rex/src/common/Memory.cpp \
	../rex/src/common/OutputFile.cpp \
	../rex/src/compress/Compress.cpp \
	../rex/src/lexer/CharSet.cpp \
	../rex/src/lexer/CodeGeneratorCLike.cpp \
	../rex/src/lexer/CodeGeneratorCpp.cpp \
	../rex/src/lexer/CodeGeneratorGo.cpp \
	../rex/src/lexer/CodeGeneratorHaxe.cpp \
	../rex/src/lexer/CodeGeneratorJava.cpp \
	../rex/src/lexer/CodeGeneratorJavascript.cpp \
	../rex/src/lexer/CodeGeneratorPython.cpp \
	../rex/src/lexer/CodeGeneratorScala.cpp \
	../rex/src/lexer/CodeGeneratorTypescript.cpp \
	../rex/src/lexer/CodeGeneratorXQuery.cpp \
	../rex/src/lexer/CodeGeneratorXSLT.cpp \
	../rex/src/lexer/Dfa.cpp \
	../rex/src/lexer/LexerGenerator.cpp \
	../rex/src/lexer/LexerGeneratorImpl.cpp \
	../rex/src/lexer/Nfa.cpp \
	../rex/src/lexer/SymbolTable.cpp \
	../rex/src/lexer/Syntax.cpp \
	../rex/src/parser/AutomaticSemicolonInsertion.cpp \
	../rex/src/parser/CompressedTokenSet.cpp \
	../rex/src/parser/Grammar.cpp \
	../rex/src/parser/ItemSet.cpp \
	../rex/src/parser/LookaheadCompressor.cpp \
	../rex/src/parser/Naming.cpp \
	../rex/src/parser/OrderedTokenSequenceVector.cpp \
	../rex/src/parser/ParserGenerator.cpp \
	../rex/src/parser/PredictionBuilder.cpp \
	../rex/src/parser/PrintCLike.cpp \
	../rex/src/parser/PrintCSharp.cpp \
	../rex/src/parser/PrintCpp.cpp \
	../rex/src/parser/PrintEbnf.cpp \
	../rex/src/parser/PrintGo.cpp \
	../rex/src/parser/PrintHaxe.cpp \
	../rex/src/parser/PrintJava.cpp \
	../rex/src/parser/PrintJavascript.cpp \
	../rex/src/parser/PrintPython.cpp \
	../rex/src/parser/PrintREx.cpp \
	../rex/src/parser/PrintScala.cpp \
	../rex/src/parser/PrintTypescript.cpp \
	../rex/src/parser/PrintXML.cpp \
	../rex/src/parser/PrintXQuery.cpp \
	../rex/src/parser/PrintXSLT.cpp \
	../rex/src/parser/ReportConflicts.cpp \
	../rex/src/parser/Token.cpp \
	../rex/src/parser/TokenSequence.cpp \
	../rex/src/parser/TokenSequenceSet.cpp \
	../rex/src/parser/TokenSequenceSets.cpp \
	../rex/src/parser/WcsSet.cpp \
	../rex/src/template/CodeTemplate.cpp
