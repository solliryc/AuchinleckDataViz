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
var height = 400;
var width = 900;
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
    showChapterHistogram()
    //showYearHistogram()
    //showCategoryBarChart()
}

function showChapterHistogram() {
    var chartHeight = height - margin.bottom
    var chartWidth = width - margin.right
    var widthPie = 450
    var heightPie = 450
    var marginPie = 40
    var entryData = lexiconData.filter(function(d) {return d.lexicon_word == 'faders'})

    console.log(entryData)
    console.log(chapterTitleData)

    var entryChapterData = []
    chapterTitleData.forEach(chapterData => {
        chapterAbbrev = chapterData.chapter_abbrev
        chapterTitle = chapterData.chapter_title
        chapterOccurrences = chapterAbbrev + '_occurrences'
        entryObject = {}

        entryData.forEach(entry => {
            if (entry[chapterOccurrences] != 0) {
                console.log(chapterOccurrences)
                entryObject['chapterAbbrev'] = chapterAbbrev
                entryObject['chapterTitle'] = chapterTitle
                entryObject['chapterOccurrences'] = entry[chapterOccurrences]
            }
        })
        if (entryObject['chapterTitle']) {
            entryChapterData.push(entryObject)
        }
    })
    console.log(entryChapterData)
    var yMax = d3.max(entryChapterData, function(d) {return +d.chapterOccurrences})

    var arcs = d3.pie()(entryChapterData.map(function(d) {return d.chapterOccurrences}))
    console.log(arcs[0])

    var width = 300
	var height = 300
	// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
    var radius = Math.min(width, height) / 2
    
    var color = d3.scaleOrdinal()
        .range(d3.schemeSet2);
        
    var pie = d3.pie()
        .value(function(d) { return d.chapterOccurrences; })(entryChapterData);

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);
    
    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var svg = d3.select(".main")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width/2 + "," + height/2 +")")

    var g = svg.selectAll("arc")
        .data(pie)
        .enter().append("g")
        .attr("class", "arc");
    
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.chapterTitle);});
}

function showYearHistogram() {
    // initialize variables
    var chartHeight = height - margin.bottom
    var chartWidth = width - margin.right
    var colorArray = ['blue', 'red', 'green'];
    var weightedBool = false
    var occurrencesBool = false

    //
    lexiconData.forEach(entry => {
        entry.year = (+entry.year_from_1 + +entry.year_to_1) / 2
    })
    // to find min that is not 0: use of constant Infinity, since Math.min(Infinity, someNumber) always return someNumber
    var minYear = d3.min(lexiconData, function(d) {return +d.year || Infinity;})
    var maxYear = d3.max(lexiconData, function(d) {return +d.year})
    var yearRange = 50
    console.log(minYear, maxYear)
    
    // round down the mininmum year (if yearRange == 25 and minYear == 1090, rounding minYear to 1075)
    if (minYear % yearRange != 0) {
        while (minYear % yearRange != 0) {
            minYear = minYear - 1
        }
    }

    // round up the maximum year (if yearRange == 25 and maxYear == 1630, rounding maxYear to 1650)
    if (maxYear % yearRange != 0) {
        while (maxYear % yearRange != 0) {
            maxYear = maxYear + 1
        }
    }

    // create a list of threshold values for the creation of histogram bins
    var yearThreshold = []
    var yearStep = minYear
    while (yearStep <= maxYear) {
        yearThreshold.push(yearStep)
        yearStep = yearStep + yearRange
    }

    // create svg object
    const histo_svg = d3.select('.main')
        .append('svg')
            .attr("width", width)
            .attr('height', height)

    // create horizontal scale
    var x = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([margin.left, chartWidth]);

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) {return +d.year})
        .domain(x.domain())
        .thresholds(yearThreshold);

    // get the bins by fitting the lexiconData
    var bins = histogram(lexiconData);
    var bins1 = histogram(lexiconData.filter(function(d) {return d.french_etymology == 1}))
    var bins2 = histogram(lexiconData.filter(function(d) {return d.other_etymology == 1}))
    var bins3 = histogram(lexiconData.filter(function(d) {return d.unknown_etymology == 1}))

    var binsList = [bins1, bins2, bins3]
    var binsCount = binsList.length

    var binsMaxHeight = 0

    if (weightedBool) {
        // if values are weighted
        for (let i = 0; i < binsList.length; i++) {
            bins = binsList[i]
            totalBinsLength = d3.sum(bins, function(d) {return +d.length})
            var totalBinsOccurrences = 0
            bins.forEach(bin => {
                totalBinsOccurrences = totalBinsOccurrences + d3.sum(bin, function(d) {return +d.occurrences})
            })
    
            for (let j = 0; j < bins.length; j++) {
                if (occurrencesBool) {
                    binOccurrences = d3.sum(bins[j], function(d) {return +d.occurrences})
                    binsHeight = binOccurrences / totalBinsOccurrences
                } else {
                    binLength = binsList[i][j].length
                    binsHeight = binLength / totalBinsLength
                }
                binsList[i][j].weighted = binsHeight
    
                if (binsHeight > binsMaxHeight) {
                    binsMaxHeight = binsHeight
                }
            }
        }
    } else {
        // else if values are not weighted
        var binsHeightList = []
        binsList.forEach(bins => {
            // for each set of bins in the list
            bins.forEach(bin => {
                // for each bin
                if (occurrencesBool) {
                    // if showing by number of occurrences (tokens), compute the sum of occurrences of the bin
                    binSize = d3.sum(bin, function(d) {return +d.occurrences})
                } else {
                    // if showing by number of words (types), get the size value of the bin
                    binSize = bin.length
                }
                // add the size value of the bin to a list, add size value to the bin Object
                binsHeightList.push(binSize)
                bin.size = binSize
            })
        })
        // get the size of the biggest bin in all bins
        binsMaxHeight = d3.max(binsHeightList)
    }
    
    // create vertical scale
    var y = d3.scaleLinear()
        .range([chartHeight, margin.top])
        .domain([0, binsMaxHeight]);

    // add x axis
    histo_svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x));
    
    // add y axis
    histo_svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));
    
    // remove first and last threshold, to hide first and last threshold line
    yearThreshold.splice(0, 1)
    yearThreshold.pop()

    // add threshold lines
    histo_svg.append('g')
        .selectAll('line')
        .data(yearThreshold)
        .join('line')
            .style("stroke", "grey")
            .style('stroke-width', '2px')
            .style('stroke-dasharray', 10)
            .attr("x1", d => x(d))
            .attr("x2", d => x(d))
            .attr("y1", chartHeight + margin.top)
            .attr("y2", margin.bottom);

    // create info bubble to display info when overing mouse on bins
    var tooltip = d3.select("body")
        .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("z-index", '10')
            .style("visibility", "hidden")
            .style("opacity", 1)
            .style("background-color", "black")
            .style("color", "white")
            .style("border-radius", "5px")
            .style("padding", "10px")

    // show tooltip when mouse is over a bin
    var showTooltip = function(d) {
        if (weightedBool) {
            tooltipString = `Year range: ${d.x0} - ${d.x1}</br>Frequency: ${Math.round(d.weighted * 100)}%`
        } else {
            tooltipString = `Year range: ${d.x0} - ${d.x1}</br>Total: ${d.size}`
        }
        tooltip
            .style('visibility', 'visible')
            .html(tooltipString)
        d3.selectAll('rect')
            .style('opacity', 0.6)
        d3.select(this)
            .style("stroke", "black")
            .style('stroke-width', '2px')
            .style('stroke-opacity', 0)
            .style("opacity", 1)
            .style('z-index', '5')
    }

    // move tooltip when mouse moves over a bin
    var moveTooltip = function() {
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left", (event.pageX + 10) + "px")
    }

    // hide tooltip when mouse leaves a bin
    var hideTooltip = function() {
        tooltip
            .style("visibility", "hidden")
        d3.selectAll('rect')
            .style('opacity', 1)
        d3.select(this)
            .style("stroke", 'none')
            .style("opacity", 1)
    }

    // set the bin width to avoid having a slim first and last bin 
    // - binsCount: create a space of x pixels between each bin
    // / binsCount: splits the horizontal space of one bin into number of variables (if 3 variables, it divides bin_width by 3 to fill 3 bins in the space of 1 )
    bin_width = d3.max(bins, function(d) {return x(d.x1) -x(d.x0) - binsCount}) / binsCount
    console.log(binsList)
    
    // bars to histrogram
    for (let i = 0; i < binsList.length; i++) {
        histo_svg.append('g')
            .selectAll('rect' + i.toString())
            .data(binsList[i])
            .join('rect')
                .attr('x', 1)
                // bin_width * i: if there are 3 variables, i=2 so the bin is translate horizontally by 2 bin_width
                // + i: if there are 3 variables, i=2, so it adds 2 pixel of horizontal space to keep 1 pixel space between each bin
                .attr('transform', function(d) {
                    if (weightedBool) {
                        return `translate(${bin_width * i + x(d.x0) + i}, ${y(d.weighted)})`
                    } else {
                        return `translate(${bin_width * i + x(d.x0) + i}, ${y(d.size)})`
                    }
                })
                .attr('width', bin_width)
                .attr('height', function(d) {
                    if (weightedBool) {
                        return chartHeight - y(d.weighted)
                    } else {
                        return chartHeight - y(d.size)
                    }
                })
                .attr('fill', colorArray[i])
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseout", hideTooltip)
    }
}

function showCategoryBarChart() {
    // get the data for each etymology category
    var etymologyCategoryData = []
    etymologyCategoryLabels.forEach(category => {
        totalCategory = d3.sum(lexiconData, function(d) {return +d[category.category_key]})
        etymologyCategoryData.push({total: totalCategory, label: category.category_name})
    });
    console.log(etymologyCategoryData)

    // initialize chart variables
    var chartHeight = height - margin.bottom
    var chartWidth = width - margin.right
    var duration = 800
    var delay = 200
    var yMax = d3.max(etymologyCategoryData, function(d) {return +d.total})
    console.log(yMax)

    // create svg object
    const bar_chart_svg = d3.select('.main')
        .append('svg')
            .attr('width', width)
            .attr('height', height)

    // create vertical scale
    const y = d3.scaleLinear()
        .domain([0, yMax])
        .range([chartHeight, margin.top])
        .interpolate(d3.interpolateRound)

    // create horizontal scale
    const x = d3.scaleBand()
        .domain(etymologyCategoryData.map(d => d.label))
        .range([margin.left, chartWidth])
        .padding(0.1)
        .round(true)
    
    // create color scale
    const bar_color = d3.scaleSequential()
        .domain([0, yMax])
        .interpolator(d3.interpolateBlues)

    // add the bar rectangles to the svg element
    bar_chart_svg.append('g')
        .selectAll('rect')
        .data(etymologyCategoryData)
        .enter()
        .append('rect')
            .attr('height', chartHeight - y(0))
            .attr('width', x.bandwidth())
            .attr('y', y(0))
            .attr('x', d => x(d.label))
            .style('fill', d=> bar_color(d.total))

    // add x axis
    bar_chart_svg.append('g')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x))

    // add y axis
    bar_chart_svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))

    // animation of bars
    bar_chart_svg.selectAll('rect')
        .transition()
        .duration(duration)
        .attr("y", function(d) {return y(d.total);})
        .attr("height", function(d) {return chartHeight - y(d.total);})
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
                "Word: " + entryData.lexiconWord + '</br>' + 
                "Year range: " + entryData.yearRange + '</br>' +
                "Etymology: " + entryData.wordEtymology + '</br>' +
                "Appears in: " + entryData.wordChapters + '</br>' +
                "MED entry: <a href=" + entryData.medLink + " target='_blank'>" + entryData.medWord + "</a>";
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
    lexiconWord = '<span id="resultWord">' + lexiconEntry.lexicon_word + '</span>'
    yearRange = '<span id="resultYearFrom">' + lexiconEntry.year_from_1 + '</span>' + " - " + '<span id="resultYearTo">' + entry.year_to_1 + '</span>'
    medWord = lexiconEntry.med_word
    medLink = "https://quod.lib.umich.edu/m/middle-english-dictionary/dictionary/MED" + lexiconEntry.med_id
    wordEtymology = "Unknown etymology"
    // iterate over all etymologies to find those of the word (where etymology == 1)
    etymologyData.forEach(etymology => {
        langAbbrev = etymology.language_abbrev
        langName = etymology.language_name
        if (lexiconEntry[langAbbrev] == 1) {
            if (wordEtymology == "Unknown etymology") {
                wordEtymology = '<span id="' + langAbbrev + '">' + langName + '</span>'
            } else {
                wordEtymology = wordEtymology + " - " + '<span id="' + langAbbrev + '">' + langName + '</span>'
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
