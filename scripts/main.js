var lexiconData = [];
var etymologiesData = [];
var frenchEtymologies = [];
var words = [];

/* d3.csv('../data/test_lexicon.csv', function(d){
    lexicon_array.push(d)
    return {
        lexicon_array
    }
}).then(function(data) {
    console.log(lexicon_array)
    for (let i = 0; i < lexicon_array.length; i++) {
        const entry = lexicon_array[i];
        if (entry.french_etymology == 1) {
            console.log(entry.lexicon_word, entry.french_etymology)
        }
        
    }
}); */

function setup () {
	// Charger les données (Attention: opération asynchrone !)
	loadData();
}

function loadData() {
	// Attention, il s'agit d'une opération asynchrone !
	// Une fois les données chargées, la promise sera résolue (.then) et
    // le callback `onDataLoaded` sera appelé en passant les données en paramètre
    Promise.all([
        d3.csv('../data/med_merge_lexicon_chapters_final_v2.csv'),
        d3.csv('../data/med_etymologies.csv'),
    ]).then(function(files){
        onDataLoaded(files)
    })
    /*
	d3.csv('../data/test_lexicon.csv', function (d) {
		return {
            d
            //lexiconWord: d.lexicon_word,
			//station: d.stn,
			//year: parseInt(d.time.substr(0, 4)),
			//month: parseInt(d.time.substr(4, 2)),
            //temp_moy: parseFloat(d.tre200m0)
		}
    }).then(onDataLoaded);
    */
}

function onDataLoaded(data) {
	// Stocker ces données dans une variable déclarée dans le scope de ce
    // script. Permettant ainsi d'utiliser ces données dans d'autres fonctions
    console.log(data)
    lexiconData = data[0]
    etymologiesData = data[1]
    frenchAbbrevList = ['AF', 'AN', 'CF', 'F', 'MF', 'MnF', 'NF', 'OF', 'ONF', 'OProv.', 'Prov.']
    console.log(lexiconData)
    console.log(etymologiesData)
    console.log(frenchAbbrevList)
    
    etymologiesData.forEach(etymology => {
        abbrev = etymology.language_abbrev
        name = etymology.language_name
        if (frenchAbbrevList.includes(abbrev)) {
            frenchEtymologies.push({'language_abbrev': abbrev, 'language_name': name})
        }
        //console.log(etymology.language_abbrev, etymology.language_name)
    });

    lexiconData.forEach(entry => {
        words.push(entry.lexicon_word)
    });
    console.log(frenchEtymologies)
}

setup();

function displaySearchResult() {
    var x = document.getElementById("searchResult")
    if (x.style.display === 'none') {
        x.style.display = 'inline-block'
    }
    searchValue = document.getElementById("searchWord").value
    // if a non-empty string has been submitted
    if (searchValue) {
        // search the string in the lexicon
        lexiconEntry = searchWordInLexicon(searchValue)
        // if the string exists in lexicon
        if (lexiconEntry != undefined) {
            console.log('value found in lexicon')
            console.log(lexiconEntry)
            // get the word form, year range, MED word, web link to the MED entry, and etymologies of the lexicon entry
            lexiconWord = lexiconEntry.lexicon_word
            wordYearRange = lexiconEntry.year_from_1 + "-" + entry.year_to_1
            medWord = lexiconEntry.med_word
            medLink = "https://quod.lib.umich.edu/m/middle-english-dictionary/dictionary/MED" + lexiconEntry.med_id
            wordEtymologies = "Unknown etymology"
            // iterate over all etymologies to find those of the word (where etymology == 1)
            etymologiesData.forEach(etymology => {
                langAbbrev = etymology.language_abbrev
                langName = etymology.language_name
                if (lexiconEntry[langAbbrev] == 1) {
                    if (wordEtymologies == "Unknown etymology") {
                        wordEtymologies = langName
                    } else {
                        wordEtymologies = wordEtymologies + " - " + langName
                    }
                }
            })
            document.getElementById("searchResult").innerHTML = 
                "Word: " + lexiconWord + 
                "</br> Year range: " + wordYearRange +
                "</br> Etymology: " + wordEtymologies +
                "</br> MED entry: <a href=" + medLink + " target='_blank'>" + medWord + "</a>";
        } else {
            document.getElementById("searchResult").innerHTML = "Please enter a word used in Auchinleck Manuscript"
        }
    } else {
        document.getElementById("searchResult").innerHTML = "Please enter a word"
    }
}

function searchWordInLexicon(searchWord) {
    for (var i=0; i < lexiconData.length; i++) {
        if (lexiconData[i].lexicon_word === searchWord) {
            entry = lexiconData[i]
            return entry;
        }
    }
}

function autocomplete(input, array) {
    // Code taken from https://www.w3schools.com/howto/howto_js_autocomplete.asp

    /*the autocomplete function takes two arguments, the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    input.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "-autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < array.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (array[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + array[i].substr(0, val.length) + "</strong>";
                b.innerHTML += array[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + array[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    input.value = this.getElementsByTagName("input")[0].value;
                    /* simulate a click on the search button */
                    document.getElementById("searchButton").click();
                    /*close the list of autocompleted values, (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    input.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "-autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed, decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /* if active item in list of suggestions, simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            } else {
                /* simulate a click on the search button*/
                document.getElementById("searchButton").click();
            }
        }
        if (e.keyCode == 13) {
            /* if the ENTER key is pressed, prevent the form from being submitted*/
            e.preventDefault()
            /* simulate a click on the search button*/
            document.getElementById("searchButton").click();
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
        /*scroll the list of suggestions into view */
        var elmnt = document.getElementsByClassName("autocomplete-active")[0]
        elmnt.scrollIntoView(false)
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document, except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function onSelect(d) {
    // Code taken from https://www.w3schools.com/howto/howto_js_autocomplete.asp
    alert(d.State);
}

//Setup and render the autocomplete
function start() {
    // Code taken from https://www.w3schools.com/howto/howto_js_autocomplete.asp
    var mc = autocomplete(document.getElementById('test'))
            .keys(keys)
            .dataField("State")
            .placeHolder("Search States - Start typing here")
            .width(960)
            .height(500)
            .onSelected(onSelect)
            .render();
}
