// initialize variables
var lexiconData = [];
var etymologyData = [];
var chapterTitleData = [];
var frenchEtymologies = [];
var words = [];

// initialize constant variables
const frenchAbbrevList = ['AF', 'AN', 'CF', 'F', 'MF', 'MnF', 'NF', 'OF', 'ONF', 'OProv.', 'Prov.']
const latinAbbrevList = []
const etymologyCategoryLabels = [
    {category_key:'french_etymology', category_name: 'French-based words'},
    {category_key:'latin_etymology', category_name: 'Latin-based words'},
    {category_key:'other_etymology', category_name: 'Other etymology'},
    {category_key:'unknown_etymology', category_name: 'Unknown etymology'}
]

// initialize variables with value
var height = 300;
var width = 600;
var margin = ({top: 20, right: 20, bottom: 20, left: 40})

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
        d3.csv('../data/chapters_title.csv'),
    ]).then(function(files){
        onDataLoaded(files)
    })
}

function onDataLoaded(data) {
	// Stocker ces données dans une variable déclarée dans le scope de ce
    // script. Permettant ainsi d'utiliser ces données dans d'autres fonctions
    console.log(data)
    lexiconData = data[0]
    etymologyData = data[1]
    chapterTitleData = data[2]
    
    etymologyData.forEach(etymology => {
        abbrev = etymology.language_abbrev
        name = etymology.language_name
        if (frenchAbbrevList.includes(abbrev)) {
            frenchEtymologies.push({'language_abbrev': abbrev, 'language_name': name})
        }
    });

    lexiconData.forEach(entry => {
        words.push(entry.lexicon_word)
    });
    console.log(frenchEtymologies)
    displayHistogram()
    //displayBarChart()

}

function displayHistogram() {
    var chart_height = height - margin.bottom
    var chart_width = width - margin.right

    // to find min that is not 0: use of constant Infinity, since Math.min(Infinity, someNumber) always return someNumber
    var min_year = d3.min(lexiconData, function(d) {return +d.year_from_1 || Infinity;})
    var max_year = d3.max(lexiconData, function(d) {return +d.year_from_1})
    var year_range = 20

    console.log(min_year, max_year)
    if (min_year % year_range != 0) {
        console.log(min_year)
        while (min_year % year_range != 0) {
            min_year = min_year - 1
        }
    }
    if (max_year % year_range != 0) {
        console.log(max_year)
        while (max_year % year_range != 0) {
            max_year = max_year + 1
        }
    }
    var year_threshold = []
    var year_step = min_year
    while (year_step <= max_year) {
        year_threshold.push(year_step)
        year_step = year_step + year_range
    }

    nbr_bins = (max_year - min_year) / year_range

    console.log(min_year, max_year, nbr_bins)
    console.log(year_threshold)

    const histo_svg = d3.select('.main')
        .append('svg')
            .attr("width", width)
            .attr('height', height)
        //.append("g")
        //    .attr("transform", `translate(${margin.left}, ${margin.top})`)

    var x = d3.scaleLinear()
        .domain([min_year, max_year])
        .range([margin.left, chart_width]);
    
    histo_svg.append("g")
        .attr("transform", `translate(0, ${chart_height})`)
        .call(d3.axisBottom(x));

      // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) {return +d.year_from_1})   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(year_threshold); // then the numbers of bins

    // And apply this function to data to get the bins.
    var bins = histogram(lexiconData);
    console.log(bins.length)

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([chart_height, margin.top])
        .domain([0, d3.max(bins, function(d) {return d.length})]);
    
    histo_svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    bin_width = d3.max(bins, function(d) {return x(d.x1) -x(d.x0) -1})
    
    // append the bar rectangles to the svg element
    histo_svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) {return `translate(${x(d.x1)}, ${y(d.length)})`})
            .attr("width", bin_width)
            .attr("height", function(d) {return chart_height - y(d.length)})
            .style("fill", "#69b3a2")
}

function displayBarChart() {
    // create svg object
    const bar_chart_svg = d3.select('.main')
        .append('svg')
            .attr('width', width)
            .attr('height', height)

    console.log(bar_chart_svg)

    var etymologyCategoryData = []
    etymologyCategoryLabels.forEach(category => {
        totalCategory = d3.sum(lexiconData, function(d) {return +d[category.category_key]})
        etymologyCategoryData.push({total: totalCategory, label: category.category_name})
    });
    console.log(etymologyCategoryData)

    // initialize chart variables
    var chart_height = height - margin.bottom
    var chart_width = width - margin.right
    var duration = 800
    var delay = 200
    var y_max = d3.max(etymologyCategoryData, function(d) {return +d.total})
    console.log(y_max)

    // create vertical scale
    const y = d3.scaleLinear()
        .domain([0, y_max])
        .range([chart_height, margin.top])
        .interpolate(d3.interpolateRound)

    // create horizontal scale
    const x = d3.scaleBand()
        .domain(etymologyCategoryData.map(d => d.label))
        .range([margin.left, chart_width])
        .padding(0.1)
        .round(true)
    
    // create color scale
    const bar_color = d3.scaleSequential()
        .domain([0, y_max])
        .interpolator(d3.interpolateBlues)

    // add bars to chart
    bar_chart_svg.append('g')
        .selectAll('rect')
        .data(etymologyCategoryData)
        .enter()
        .append('rect')
            .attr('height', chart_height - y(0))
            .attr('width', x.bandwidth())
            .attr('y', y(0))
            .attr('x', d => x(d.label))
            .style('fill', d=> bar_color(d.total))

    bar_chart_svg.append('g')
        .attr("transform", `translate(0, ${chart_height})`)
        .call(d3.axisBottom(x))

    bar_chart_svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))

    // Animation
    bar_chart_svg.selectAll('rect')
        .transition()
        .duration(duration)
        .attr("y", function(d) {return y(d.total);})
        .attr("height", function(d) {return chart_height - y(d.total);})
        .delay((d,i) => {return(i*delay)})

    // add titles
    bar_chart_svg.append('g')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${x.bandwidth() / 2}, 10)`)
        .selectAll('text')
        .data(etymologyCategoryData)
        .enter()
        .append('text')
            .style('fill', d => d3.lab(bar_color(d.total)).l < 60 ? 'white' : 'black')
            .attr('fill-opacity', 0)
            .attr('y', d => y(d.total))
            .attr('x', d => x(d.label))
            .attr('dy', '0.35em')
            .text(d => d.total)
            .transition()
                .duration(duration)
                .delay((d,i) => {return(i*delay + duration)})
                .attr('fill-opacity', 1)
}

function displaySearchResult() {
    searchValue = document.getElementById("searchWord").value
    // if a non-empty string has been submitted
    if (searchValue) {
        // make the DIV where the search result appears visible
        var x = document.getElementById("searchResult")
        if (x.style.display === 'none') {
            x.style.display = 'inline-block'
        }
        // search the string in the lexicon
        lexiconEntry = searchWordInLexicon(searchValue)
        // if the string exists in lexicon
        if (lexiconEntry != undefined) {
            console.log('value found in lexicon')
            console.log(lexiconEntry)
            // get the data from lexicon entry
            entryData = getEntryData(lexiconEntry)
            // display the search result
            document.getElementById("searchResult").innerHTML = 
                "Word: " + entryData.lexiconWord + 
                "</br> Year range: " + entryData.yearRange +
                "</br> Etymology: " + entryData.wordEtymology +
                "</br> Appears in: " + entryData.wordChapters +
                "</br> MED entry: <a href=" + entryData.medLink + " target='_blank'>" + entryData.medWord + "</a>";
        } else {
            // display a message when searched word is not in the lexicon
            document.getElementById("searchResult").innerHTML = "Please enter a word used in Auchinleck Manuscript"
        }
    } else {
        // hide the DIV where the search result appears
        var x = document.getElementById("searchResult")
        if (x.style.display === 'inline-block') {
            x.style.display = 'none'
        }
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

function getEntryData(lexiconEntry) {
    // get the word form, year range, MED word, web link to the MED entry, and etymology of the lexicon entry
    lexiconWord = lexiconEntry.lexicon_word
    yearRange = lexiconEntry.year_from_1 + "-" + entry.year_to_1
    medWord = lexiconEntry.med_word
    medLink = "https://quod.lib.umich.edu/m/middle-english-dictionary/dictionary/MED" + lexiconEntry.med_id
    wordEtymology = "Unknown etymology"
    // iterate over all etymologies to find those of the word (where etymology == 1)
    etymologyData.forEach(etymology => {
        langAbbrev = etymology.language_abbrev
        langName = etymology.language_name
        if (lexiconEntry[langAbbrev] == 1) {
            if (wordEtymology == "Unknown etymology") {
                wordEtymology = langName
            } else {
                wordEtymology = wordEtymology + " - " + langName
            }
        }
    })
    wordNbrChapters = lexiconEntry.nbr_texts
    wordChapters = ""
    // iterate over all chapter titles to find those where the word appears (where title == 1)
    chapterTitleData.forEach(chapterTitle => {
        title_short = chapterTitle.chapter_abbrev
        title_full = chapterTitle.chapter_title
        if (wordNbrChapters > 3) {
            wordChapters = wordNbrChapters + " chapters of Manuscript"
        } else {
            if (lexiconEntry[title_short] == 1) {
                if (wordChapters == "") {
                    wordChapters = title_full
                } else {
                    wordChapters = wordChapters + " - " + title_full
                }
            }
        }
    })
    return {
        lexiconWord: lexiconWord,
        yearRange: yearRange,
        medWord: medWord,
        medLink: medLink,
        wordEtymology: wordEtymology,
        wordChapters: wordChapters,
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

setup()
autocomplete(document.getElementById("searchWord"), words);
