"use strict";

// Perf TODO:
// Merge material updating with psq values
// Put move scoring inline in generator
// Remove need for fliptable in psq tables.  Access them by color
// Optimize pawn move generation

// Non-perf todo:
// Checks in first q?
// Pawn eval.
// Better king evaluation
// Better move sorting in PV nodes (especially root)

var g_debug = true;
var g_timeout = 40;

function GetFen(){
    var result = "";
    for (var row = 0; row < 8; row++) {
        if (row != 0)
            result += '/';
        var empty = 0;
        for (var col = 0; col < 8; col++) {
            var piece = g_board[((row + 2) << 4) + col + 4];
            if (piece == 0) {
                empty++;
            }
            else {
                if (empty != 0)
                    result += empty;
                empty = 0;

                var pieceChar = [" ", "p", "n", "b", "r", "q", "k", " "][(piece & 0x7)];
                result += ((piece & colorWhite) != 0) ? pieceChar.toUpperCase() : pieceChar;
            }
        }
        if (empty != 0) {
            result += empty;
        }
    }

    result += g_toMove == colorWhite ? " w" : " b";
    result += " ";
    if (g_castleRights == 0) {
        result += "-";
    }
    else {
        if ((g_castleRights & 1) != 0)
            result += "K";
