// initialize constant variables
const height = 450;
const width = 900;
const margin = {top: 20, right: 20, bottom: 50, left: 70};

const widthPie = 350;
const heightPie = 350;
const marginPie = {top: 20, right: 20, bottom: 20, left: 20};

const widthLolli = 500;
const heightLolli = 350;
const marginLolli = {top: 20, right: 30, bottom: 50, left: 50};

// initialize booleans
var weightedBool = false;
var occurrencesHistoBool = false;
var occurrencesBarChartBool = false;
var compositionYearBool = false;
var yearHistoOption = 'radio-manuscript'

// initialize empty arrays
var lexiconData = [];
var etymologyData = [];
var chapterTitleData = [];
var frenchEtymologies = [];
var words = [];
var stopWords = [];
var colorEtymology = [];

// initialize empty objects
var etymologyOptions = {};

// create svg object for pie chart
const svgPie = d3.select("#chapterPie")
    .append("svg")
        .attr('id', 'svgPie')
        .style('display', 'none')
        .attr("width", widthPie)
        .attr("height", heightPie)
        .append("g")
            .attr("transform", `translate(${widthPie/2}, ${heightPie/2 + marginPie.top})`);

const svgLolli = d3.select('#wordsLollipop')
    .append('svg')
        .attr('id', 'svgLolli')
        .style('display', 'none')
        .attr('width', widthLolli)
        .attr('height', heightLolli)
        .append("g")
            .attr("transform", `translate(${marginLolli.left}, ${marginLolli.top})`);


// create svg object for year histogram
const svgHisto = d3.select('#yearHistogram')
    .append('svg')
        .attr("width", width)
        .attr('height', height);

// create svg object
const svgBarChart = d3.select('#categoryBarChart')
.append('svg')
    .attr('id', 'svgBarChart')
    .attr('width', width)
    .attr('height', height);

// create svg object for year histogram
const svgScatter = d3.select('#yearScatterPlot')
    .append('svg')
        .attr("width", width)
        .attr('height', height);

// initialize constant variables
const frenchAbbrevList = ['AF', 'AN', 'CF', 'F', 'MF', 'MnF', 'NF', 'OF', 'ONF', 'OProv.', 'Prov.']
const latinAbbrevList = ['AL', 'CL', 'L', 'Latinate', 'LL', 'ML', 'VL', 'MnL (16th cent.)', 'pseudo-Latin']
const englishAbbrevList = ['A', 'EM', 'K', 'LOE', 'Merc.', 'M', 'ME', 'NM', 'N', 'nEM', 'NWM', 'Nhb.', 'OE', 'OK', 'ONhb.', 'S', 'SE', 'SEM', 'SM', 'SWM', 'SW', 'Western', 'WM', 'WS']
const scandinavianAbbrevList = ['Dan.', 'Icel.', 'Norw.', 'ODan.', 'OI', 'ON', 'ONorw.', 'OSwed.', 'Scand.', 'Swed.']
const stopwordsMiddleEnglish = ['ac','afore','ake','an','because','ek','fore','for','forthi','whan','whanne','whilis','if','yf','yif','yiff','yit','yet','and','or','any','but','a','y','ne','no','not','nor','nat','however','o','than','n','nn','nnn','to','with','wyth','at','as','of','off','from','on','before','by','after','about','above','across','among','against','below','between','during','into','in','out','over','under','abord','aboven','afore','aftir','bi','bifor','bisyde','bitwixten','byfore','bytwene','down','doun','embe','fra','ine','mid','sanz','tyll','umbe','vnto','vpon','withouten','with','wth','wtout','can','cannot',"can't",'t','could','did','do','does','wyl','will','would','haven','hast','haþ','havende','hadde','haddest','hadden','had',"hadn't",'has',"hasn't",'hasn','have',"haven't",'haven','having','be','ben','been','am','art','is','ys','aren','are',"aren't",'bende',"isn't",'isn','wæs','was',"wasn't",'wasn','weren','were',"weren't",'þe','the','þat','þenne','þis','whiche','which','while','who','whom','what','when','where','why','that',"that's",'s','there','ther','þer',"there's",'these','this','those','boþe','thilke','eiþer','either','neither','al','all','also','ane','ic','ich','i',"i'd",'d',"i'll",'ll',"i'm",'m',"i've",'ve','me','mi','my','minen','min','mire','minre','myself','þu','þou','tu','þeou','thi','you','þe','þi','ti','þin','þyn','þeself',"you'd","you'll","you're",'re',"you've",'your','yours','yourself','yourselves','thee','thy','thou','ye','thine','he',"he'd","he'll","he's",'she','sche',"she'd","she'll","she's",'her','heo','hie','hies','hire','hir','hers','hio','heore','herself','him','hine','hisse','hes','himself','his','hys','hym','hit','yt','it','its',"it's",'tis','twas','itself','þay','youre','hyr','hem','we',"we'd","we'll","we're","we've",'us','ous','our','ure','ures','urne','ours','oures','ourselves','their','theirs','them','themselves','thai','thei','they',"they'd","they'll","they're","they've",'whan']

const etymologyCategoryLabels = [
    {abbrev:'french_etymology', name: 'French-based etymology', color: 'rgb(186, 176, 171)'},
    {abbrev:'latin_etymology', name: 'Latin-based etymology', color: 'rgb(78, 121, 167)'},
    {abbrev:'english_etymology', name: 'English-based etymology', color: 'rgb(242, 142, 44)'},
    {abbrev:'scandinavian_etymology', name: 'Scandinavian-based etymology', color: 'rgb(225, 87, 89)'},
    {abbrev:'other_etymology', name: 'Other etymology', color: 'rgb(118, 178, 183)'},
    {abbrev:'unknown_etymology', name: 'Unknown etymology', color: 'rgb(89, 161, 79)'}
];

const defaultEtymologySelectedOptions = [
    {abbrev: 'all', name: 'All etymologies', color: 'rgb(237, 201, 73)'},
];
var etymologySelectedOptionsHisto = defaultEtymologySelectedOptions;
var etymologySelectedOptionsBar = etymologyCategoryLabels;

const defaultChapterSelectedOptions = [
    {chapter_abbrev: 'abc', chapter_title: "Alphabetical Praise of Women"}
];
var chapterSelectedOptions = defaultChapterSelectedOptions;
var chapterSelectedOptionScatter = defaultChapterSelectedOptions

function setup () {
	// Charger les données (Attention: opération asynchrone !)
    loadData();
};

function loadData() {
	// Attention, il s'agit d'une opération asynchrone !
	// Une fois les données chargées, la promise sera résolue (.then) et
    // le callback `onDataLoaded` sera appelé en passant les données en paramètre
    Promise.all([
        d3.csv('data/med_merge_lexicon_ota_final_v4.csv'),
        d3.csv('data/med_etymologies.csv'),
        d3.csv('data/chapters_title.csv'),
        d3.csv('data/all_texts_merged_v4.csv'),
    ]).then(function(files){
        onDataLoaded(files)
    })
};

function onDataLoaded(data) {
	// Stocker ces données dans une variable déclarée dans le scope de ce
    // script. Permettant ainsi d'utiliser ces données dans d'autres fonctions
    console.log(data)
    lexiconData = data[0]
    etymologyData = data[1]
    chapterTitleData = data[2]
    allChaptersTextData = data[3]

    // create words list for 
    lexiconData.forEach(entry => {
        words.push(entry.lexicon_word)
    });

    chapterSelectedOptions = chapterTitleData

    var nbrEtymology = Object.keys(etymologyOptions).length
    
    for (let i = 0; i < etymologyData.length; i++) {
        var etymology = etymologyData[i]
        var color = d3.schemeTableau10[i % 10]
        etymology.language_color = color
        colorEtymology.push(color)
    }

    // add mean years for manuscript, composition and earliest year
    lexiconData.forEach(entry => {
        entry.year_1_mean = Math.round((+entry.year_1_from + +entry.year_1_to) / 2);
        entry.year_2_mean = Math.round((+entry.year_2_from + +entry.year_2_to) / 2);
        entry.earliest_year_mean = Math.round((+entry.earliest_year_from + +entry.earliest_year_to) / 2);
    });

    autocomplete(document.getElementById("searchWord"), words);
    
    populateEtymologyOptionsListHisto()
    populateEtymologyOptionsListBar()
    populateChapterOptionList()
    populateChapterOptionListScatter()

    showYearHistogram()
    optionsYearHistogram()

    showCategoryBarChart()
    optionsCategoryBarChart()
    
    showWordsLollipop()
    d3.select('#svgLolli').style('display', 'none')
    d3.select('#note3').style('display', 'none')

    showYearScatterPlot()
    optionsYearScatterPlot()
}

function populateEtymologyOptionsListHisto() {
    // initialize etymology options selection
    var select = tail.select("#selectEtymologyHisto", {
        multiLimit: 4, 
        multiShowLimit: true,
        placeholder: 'Select the etymologies',
        search: true,
        sortGroups: 'ASC', 
        sortItems: 'ASC',
    } );

    // populate etymology options selection with the list of etymologies
    etymologyOptions = {}
    idx = 0
    for (let i = 0; i < etymologyData.length; i++) {
        const etymology = etymologyData[i]
        abbrev = etymology.language_abbrev
        name = etymology.language_name
        color = etymology.language_color
        idx = i
        
        // if there is no word of that etymology, do not put it in the list of options
        etymologySize = lexiconData.filter(function(d) {return d[abbrev] == 1}).length
        if (etymologySize < 1) {
            continue;   
        }
        if (frenchAbbrevList.includes(abbrev)) {
            group = 'French-based'
        } else if (latinAbbrevList.includes(abbrev)) {
            group = 'Latin-based'
        } else if (englishAbbrevList.includes(abbrev)) {
            group = 'English-based'
        } else if (scandinavianAbbrevList.includes(abbrev)) {
            group = 'Scandinavian-based'
        } else {
            group ='Other'
        }
        etymologyOptions[abbrev] = {
            value: name, 
            group: group, 
            description: color,
        }
    }

    // add to the options the etymology categories
    etymologyCategoryLabels.forEach(category => {
        etymologyOptions[category.abbrev] = {
            value: category.name,
            description: d3.schemeTableau10[idx % 10],
        }
        idx++
    })

    // set the default selected etymology
    etymologyOptions['all'] = {
        value: 'All etymologies', 
        description: d3.schemeTableau10[idx % 10],
        selected: true,
    }

    // add the etymologies as options for all etymology select fields
    select.options.add(etymologyOptions)
    
}

function populateEtymologyOptionsListBar() {
    // initialize etymology options selection
    var select = tail.select("#selectEtymologyBar", {
        multiShowLimit: true,
        multiSelectAll: true,
        placeholder: 'Select the etymologies',
        search: true,
        sortGroups: 'ASC', 
        sortItems: 'ASC',
    } );

    // populate etymology options selection with the list of etymologies
    etymologyOptions = {}
    idx = 0
    for (let i = 0; i < etymologyData.length; i++) {
        const etymology = etymologyData[i]
        abbrev = etymology.language_abbrev
        name = etymology.language_name
        color = etymology.language_color
        idx = i
        
        // if there is no word of that etymology, do not put it in the list of options
        etymologySize = lexiconData.filter(function(d) {return d[abbrev] == 1}).length
        if (etymologySize < 1) {
            continue;   
        }

        if (frenchAbbrevList.includes(abbrev)) {
            group = 'French-based'
        } else if (latinAbbrevList.includes(abbrev)) {
            group = 'Latin-based'
        } else if (englishAbbrevList.includes(abbrev)) {
            group = 'English-based'
        } else if (scandinavianAbbrevList.includes(abbrev)) {
            group = 'Scandinavian-based'
        } else {
            group ='Other'
        }
        etymologyOptions[abbrev] = {
            value: name, 
            group: group,
            description: color,
        }
    }

    // add to the options the etymology categories
    etymologyCategoryLabels.forEach(category => {
        etymologyOptions[category.abbrev] = {
            value: category.name,
            description: d3.schemeTableau10[idx % 10],
            selected: true,
        }
        idx++
    })

    // set the default selected etymology
    etymologyOptions['all'] = {
        value: 'All etymologies', 
        description: d3.schemeTableau10[idx % 10],
    }

    // add the etymologies as options for all etymology select fields
    select.options.add(etymologyOptions)
    
}

function populateChapterOptionListScatter() {
    // initialize etymology options selection
    var select = tail.select("#selectChapterScatter", {
        placeholder: 'Select the poems',
        search: true,
        sortItems: 'ASC',
    } );

    chapterOptions = {}
    for (let i = 0; i < chapterTitleData.length; i++) {
        const chapter = chapterTitleData[i];
        abbrev = chapter.chapter_abbrev
        title = chapter.chapter_title
        chapterOptions[abbrev] = {value: title}
    }

    // add the etymologies as options
    select.options.add(chapterOptions)
}

function populateChapterOptionList() {
    // initialize etymology options selection
    var select = tail.select("#selectChapter", {
        placeholder: 'Select the poems',
        search: true,
        sortItems: 'ASC',
        multiSelectAll: true,
    } );

    chapterOptions = {}
    for (let i = 0; i < chapterTitleData.length; i++) {
        const chapter = chapterTitleData[i];
        abbrev = chapter.chapter_abbrev
        title = chapter.chapter_title

        defaultChapterSelectedOptions.forEach(defaultOption => {
            defaultAbbrev = defaultOption.abbrev
            
            // set the default selected chapter
            if (defaultAbbrev == abbrev) {
                chapterOptions[abbrev] = {value: title, selected: true}
            } else {
                chapterOptions[abbrev] = {value: title, selected: true}
            }
        })
    }

    // add the etymologies as options
    select.options.add(chapterOptions)
}

function optionsYearHistogram() {
    // update histogram when changing the option of showing count or frequency of values
    d3.selectAll('[name="count-frequency"]')
        .on('change', function() {
            var frequencyCheck = document.getElementById('radio-frequency')

            if (frequencyCheck.checked) {
                weightedBool = true
            } else {
                weightedBool = false
            }
            showYearHistogram()
        })
    
    // update histogram when changing the option of showing words or occurrences
    d3.selectAll('[name="words-occurrences"]')
        .on('change', function() {
            var wordsCheck = document.getElementById('radio-words')
            
            if (wordsCheck.checked) {
                occurrencesHistoBool = false
            } else {
                occurrencesHistoBool = true
            }
            showYearHistogram()
        })
    
    // update histogram when selecting the etymologies
    d3.select('#selectEtymologyHisto')
        .on('change', function() {
            etymologySelectedOptionsHisto = []
            var options = Array.from(this.selectedOptions)

            options.forEach(option => {
                abbrev = option.value
                name = option.text
                color = option.getAttribute('data-description')

                var selectedOption = {abbrev: abbrev, name: option.text, color: color}
                etymologySelectedOptionsHisto.push(selectedOption)
            })
            showYearHistogram()
        })

    // update histogram when changing the option of showing year of composition or manuscript
    d3.selectAll('[name="radio-year-histo"]')
        .on('change', function() {
            var radios = document.getElementsByName('radio-year-histo')
            
            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    yearHistoOption = radios[i].value
                    break;
                }
            }

            showYearHistogram()
        })
}

function optionsCategoryBarChart() {
    d3.select('#selectChapter')
        .on('change', function(d) {
            chapterSelectedOptions = []
            var options = Array.from(this.selectedOptions)

            options.forEach(option => {
                abbrev = option.value
                title = option.text

                var selectedOption = {chapter_abbrev: abbrev, chapter_title: title}
                chapterSelectedOptions.push(selectedOption)
            })

            showCategoryBarChart()
        })

    // update bar chart when selecting the etymologies
    d3.select('#selectEtymologyBar')
        .on('change', function() {
            etymologySelectedOptionsBar = []
            var options = Array.from(this.selectedOptions)

            options.forEach(option => {
                abbrev = option.value
                name = option.text
                color = option.getAttribute('data-description')

                var selectedOption = {abbrev: abbrev, name: name, color: color}
                etymologySelectedOptionsBar.push(selectedOption)
            })

            showCategoryBarChart()
        })
    
    // update histogram when changing the option of showing words or occurrences
    d3.selectAll('[name="words-occurrences-bar"]')
        .on('change', function() {
            var wordsCheck = document.getElementById('radio-words-bar')
            
            if (wordsCheck.checked) {
                occurrencesBarChartBool = false
            } else {
                occurrencesBarChartBool = true
            }
            showCategoryBarChart()
        })
}

function optionsYearScatterPlot() {
    // update scatter plot when selecting a poem
    d3.select('#selectChapterScatter')
        .on('change', function(d) {
            chapterSelectedOptionScatter = []
            var options = Array.from(this.selectedOptions)

            options.forEach(option => {
                abbrev = option.value
                title = option.text

                var selectedOption = {chapter_abbrev: abbrev, chapter_title: title}
                chapterSelectedOptionScatter.push(selectedOption)
            })

            showYearScatterPlot()
        })

    // update scatter plot when changing the option of showing year of composition or manuscript
    d3.selectAll('[name="manuscript-composition-year"]')
        .on('change', function() {
            var compositionYearCheck = document.getElementById('radio-composition-year')

            if (compositionYearCheck.checked) {
                compositionYearBool = true
            } else {
                compositionYearBool = false
            }
            showYearScatterPlot()
        })
}

function showWordsLollipop(chapterAbbrev, color) {
    chapterOccurrences = chapterAbbrev + '_occurrences'
    //stopWords = getStopWords()
    stopWords = stopwordsMiddleEnglish
    var chapterName

    chapterTitleData.forEach(chapter => {
        if (chapter['chapter_abbrev'] == chapterAbbrev) {
            chapterName = chapter['chapter_title']
        }
    })

    filteredData = lexiconData.filter(function(d) {return d[chapterOccurrences] > 0})
    filteredData = filteredData.filter(function(d) {return (!stopWords.includes(d.lexicon_word))})
    
    mappedData = filteredData.map(entry => ({
        word: entry.lexicon_word,
        occurrences: entry[chapterOccurrences],
        nbr_texts: entry.nbr_texts,
    }))

    mappedData.sort(function(a, b) {
        return b.occurrences - a.occurrences
    })
    
    topWordsData = mappedData.slice(0, 10)

    var chartHeight = heightLolli - marginLolli.bottom - marginLolli.top
    var chartWidth = widthLolli - marginLolli.right - marginLolli.left
    var xMax = d3.max(topWordsData, function(d) {return +d.occurrences})

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
        tooltipString = `Word: ${d.word}</br>${d.occurrences} occurrences</br>in <i>${chapterName}</i>`
        tooltip
            .style('visibility', 'visible')
            .html(tooltipString)
        d3.selectAll('circle.contentLolli')
            .style('opacity', 0.6)
        d3.select(this)
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
        d3.selectAll('circle.contentLolli')
            .style('opacity', 1)
        d3.select(this)
            .style("opacity", 1)
    }

    // make the svg visible
    d3.select('#svgLolli')
        .style('display', 'inline-block')
    
    d3.select('#wordsLollipop')
        .style('margin-bottom', '50px')

    // remove previously drawn content
    d3.selectAll('.contentLolli')
        .remove()

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, chartWidth]);

    // Y axis
    var y = d3.scaleBand()
        .range([0, chartHeight])
        .domain(topWordsData.map(function(d) { return d.word; }))
        .padding(1);

    // create x axis
    svgLolli.append("g")
        .attr('class', 'contentLolli')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x))
    
    // create y axis
    svgLolli.append("g")
        .attr('class', 'contentLolli')
        .call(d3.axisLeft(y))

    // Lines
    svgLolli.append('g')
        .selectAll("myline")
        .data(topWordsData)
        .enter()
        .append("line")
            .attr('class', 'contentLolli')
            .attr("x1", function(d) { return x(d.occurrences); })
            .attr("x2", x(0))
            .attr("y1", function(d) { return y(d.word); })
            .attr("y2", function(d) { return y(d.word); })
            .attr("stroke", "grey")

    // Circles
    svgLolli.append('g')
        .selectAll("mycircle")
        .data(topWordsData)
        .enter()
        .append("circle")
            .attr('class', 'contentLolli')
            .attr("cx", function(d) { return x(d.occurrences); })
            .attr("cy", function(d) { return y(d.word); })
            .attr("r", "4")
            .style("fill", color)
            .attr("stroke", "black")
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip)

    // x axis legend
    svgLolli.append('g')
        .append('text')
        .attr('class', 'contentLolli chartLegend')
        .attr('x', chartWidth/2)
        .attr('y', heightLolli - margin.top - 5)
        .attr("text-anchor", "middle")
        .text('Number of occurrences')


    // title
    svgLolli.append('g')
        .append('text')
        .attr('class', 'contentLolli chartTitle')
        .attr('x', chartWidth/2)
        .attr('y', 0)
        .attr("text-anchor", "middle")
        .text('Most frequent words in ')
        .append('tspan')
            .text(chapterName)    
            .style('font-style', 'italic')
        .append('a')
            .attr('href', '#note3')
            .attr('baseline-shift', 'super')
            .text('3')
            .style('font-style', 'normal')
            .style('font-size', 'smaller')
            
}

function showChapterPie() {
    var resultWord = document.getElementById('resultWord').innerHTML
    var entryData = lexiconData.filter(function(d) {return d.lexicon_word == resultWord})

    var entryChapterData = []
    chapterTitleData.forEach(chapterData => {
        chapterAbbrev = chapterData.chapter_abbrev
        chapterTitle = chapterData.chapter_title
        chapterOccurrences = chapterAbbrev + '_occurrences'
        entryObject = {}

        entryData.forEach(entry => {
            if (entry[chapterOccurrences] != 0) {
                entryObject['chapterAbbrev'] = chapterAbbrev
                entryObject['chapterTitle'] = chapterTitle
                entryObject['chapterOccurrences'] = entry[chapterOccurrences]
            }
        })
        if (entryObject['chapterTitle']) {
            entryChapterData.push(entryObject)
        }
    })

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
        tooltipString = `Poem: ${d.data.chapterTitle}</br>Word occurrences: ${d.data.chapterOccurrences}`
        tooltip
            .style('visibility', 'visible')
            .html(tooltipString)
        d3.selectAll('path')
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
        d3.selectAll('path')
            .style('opacity', 1)
        d3.select(this)
            .style("stroke", 'none')
            .style("opacity", 1)
    }

    // make the svg visible
    d3.select('#svgPie')
        .style('display', 'inline-block')
    
    // remove previous drawn pie sections
    svgPie.selectAll('g')
        .remove()

    var radius = Math.min(widthPie - marginPie.left, heightPie - marginPie.top) / 2
    
    var color = d3.scaleOrdinal()
        .range(d3.schemeTableau10);
        
    pie = d3.pie()
        .value(function(d) { return d.chapterOccurrences; })(entryChapterData);

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var g = svgPie.selectAll("arc")
        .data(pie)
        .enter()
        .append("g")
            .attr("class", "arc");
    
    // draw pie chart sections
    g.append("path")
        .attr('id', function(d) {return d.data.chapterAbbrev})
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.chapterTitle);})
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)

    // title
    svgPie.append('g')
        .append('text')
        .attr('class', 'chartTitle')
        .attr('x', 0)
        .attr('y', -(heightPie)/2)
        .attr('text-anchor', 'middle')
        .text('Word occurrences in Manuscript poems')

    // make the lollipop SVG visible
    d3.select('#svgLolli')
        .style('display', 'inline-block')
    
    d3.select('#note3')
        .style('display', 'inline-block')

    // remove previously drawn lollipop chart elements
    d3.selectAll('#svgLolli > g > g')
        .remove()

    // show message in place of lollipop chart
    svgLolli.append('text')
        .attr('class', 'contentLolli')
        .attr('x', widthLolli/2 - marginLolli.left)
        .attr('y', heightLolli/2 - marginLolli.top)
        .attr('text-anchor', 'middle')
        .attr('font-style', 'italic')
        .append('tspan')
        .text('Click on a section of the pie chart')

    // show lollipop chart when clicking on a section of the pie chart
    d3.selectAll('path')
        .on('click', function(d) {
            clicked = d3.select(this)
            chapterClicked = clicked.attr('id')
            colorClicked = clicked.style('fill')
            showWordsLollipop(chapterClicked, colorClicked)
        })
}

function showYearHistogram() {
    // initialize variables
    var chartHeight = height - margin.bottom
    var chartWidth = width - margin.right
    var etymologyList = etymologySelectedOptionsHisto
    var binsList = []
    var chapterList = chapterTitleData

    const histogramData = lexiconData.filter((d) => {
        return chapterList.some((f) => {
            return d[f['chapter_abbrev']] == 1;
        });
    });

    // 
    histogramData.forEach(entry => {
        if (yearHistoOption == 'radio-manuscript') {
            entryYear = +entry.year_1_mean
        } else if (yearHistoOption == 'radio-composition') {
            entryYear = +entry.year_2_mean
        } else if (yearHistoOption == 'radio-earliest') {
            entryYear = +entry.earliest_year_mean
        }
        entry.year = entryYear
    })

    // to find min that is not 0: use of constant Infinity, since Math.min(Infinity, someNumber) always return someNumber
    var minYear = d3.min(histogramData, function(d) {return +d.year || Infinity;})
    var maxYear = d3.max(histogramData, function(d) {return +d.year})
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
    console.log(yearThreshold)

    d3.selectAll('#yearHistogram > svg > g')
        .remove()

    // create color scale
    var color = d3.scaleLinear()
        .range(d3.schemeTableau10)

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
    etymologyList.forEach(etymology => {
        if (etymology.abbrev == 'all') {
            var bins = histogram(histogramData)
        } else {
            var bins = histogram(histogramData.filter(function(d) {return d[etymology.abbrev] == 1}))
        }
        // add for each bin its etymology
        bins.forEach(bin => {bin.etymology = etymology.name})

        binsList.push(bins)
    })

    var binsCount = binsList.length
    var binsMaxHeight = 0

    // if values are weighted
    if (weightedBool) {
        // for each set of bins in the list
        for (let i = 0; i < binsList.length; i++) {
            var bins = binsList[i]
            totalBinsLength = d3.sum(bins, function(d) {return +d.length})
            var totalBinsOccurrences = 0
            bins.forEach(bin => {
                totalBinsOccurrences = totalBinsOccurrences + d3.sum(bin, function(d) {return +d.occurrences_manuscript})
            })
            
            // for each bin
            for (let j = 0; j < bins.length; j++) {
                // if showing by number of occurrences (tokens)
                if (occurrencesHistoBool) {
                    // compute the sum of occurrences of the bin, compute the weighted height of the bin
                    binOccurrences = d3.sum(bins[j], function(d) {return +d.occurrences_manuscript})
                    binsHeight = binOccurrences / totalBinsOccurrences
                // if showing by number of words (types)
                } else {
                    // get the size value of the bin, compute the weighted height of the bin
                    binLength = binsList[i][j].length
                    binsHeight = binLength / totalBinsLength
                }
                binsList[i][j].frequency = binsHeight
    
                if (binsHeight > binsMaxHeight) {
                    binsMaxHeight = binsHeight
                }
            }
        }
    // else if values are not weighted
    } else {
        var binsHeightList = []
        // for each set of bins in the list
        binsList.forEach(bins => {
            // for each bin
            bins.forEach(bin => {
                // if showing by number of occurrences (tokens)
                if (occurrencesHistoBool) {
                    // compute the sum of occurrences of the bin
                    binSize = d3.sum(bin, function(d) {return +d.occurrences_manuscript})
                // if showing by number of words (types)
                } else {
                    // get the size value of the bin
                    binSize = bin.length
                }
                // add the size value of the bin to a list, add size value to the bin Object
                binsHeightList.push(binSize)
                bin.count = binSize
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
    svgHisto.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x));
    
    // add y axis
    if (weightedBool) {
        svgHisto.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).tickFormat(d3.format('.0%')));
    } else {
        svgHisto.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y));
    }
    
    // remove first and last threshold, to hide first and last threshold line
    yearThreshold.splice(0, 1)
    yearThreshold.pop()

    // add threshold lines
    svgHisto.append('g')
        .selectAll('line')
        .data(yearThreshold)
        .join('line')
            .style("stroke", "grey")
            .style('stroke-width', '1px')
            .style('stroke-dasharray', 10)
            .style("opacity", 0.4)
            .attr("x1", d => x(d))
            .attr("x2", d => x(d))
            .attr("y1", chartHeight)
            .attr("y2", margin.bottom + margin.top);

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
        var tooltipString = `${d.etymology}</br>Year range: ${d.x0} - ${d.x1}</br>`
        if (weightedBool) {
            tooltipString = tooltipString + `Frequency: ${Math.round(d.frequency * 100)}%`
        } else {
            tooltipString = tooltipString + `Count: ${d.count}`
        }
        tooltip
            .style('visibility', 'visible')
            .html(tooltipString)
        d3.selectAll('.rectHisto')
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
        d3.selectAll('.rectHisto')
            .style('opacity', 1)
        d3.select(this)
            .style("stroke", 'none')
            .style("opacity", 1)
    }

    var downloadBinData = function(d) {
        if (confirm(`Download the list of words of ${d.etymology} (${d.x0}-${d.x1}) as .csv?`)) {
            let csv = '';
            let header = Object.keys(d[0]).join(',');
            let values = d.map(o => Object.values(o).join(',')).join('\n');
            var filename = `list_${d.etymology}_${d.x0}-${d.x1}`

            csv += header + '\n' + values;
            downloadCSV(csv, filename)   
        }
    }

    // set the bin width to avoid having a slim first and last bin 
    // - binsCount: create a space of x pixels between each bin
    // / binsCount: splits the horizontal space of one bin into number of variables (if 3 variables, it divides bin_width by 3 to fill 3 bins in the space of 1 )
    if (etymologySelectedOptionsHisto.length > 0) {
        var bin_width = d3.max(binsList[0], function(d) {return x(d.x1) -x(d.x0) - binsCount}) / binsCount
    }
    
    // bars to histrogram
    for (let i = 0; i < binsList.length; i++) {
        svgHisto.append('g')
            .selectAll('rect')
            .data(binsList[i])
            .join('rect')
                .attr('class', 'rectHisto')
                .attr('x', 1)
                // bin_width * i: if there are 3 variables, i=2 so the bin is translate horizontally by 2 bin_width
                // + i: if there are 3 variables, i=2, so it adds 2 pixel of horizontal space to keep 1 pixel space between each bin
                .attr('transform', function(d) {
                    if (weightedBool) {
                        return `translate(${bin_width * i + x(d.x0) + i}, ${y(d.frequency)})`
                    } else {
                        return `translate(${bin_width * i + x(d.x0) + i}, ${y(d.count)})`
                    }
                })
                .attr('width', bin_width)
                .attr('height', function(d) {
                    if (weightedBool) {
                        return chartHeight - y(d.frequency)
                    } else {
                        return chartHeight - y(d.count)
                    }
                })
                .attr('fill', etymologyList[i].color)
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseout", hideTooltip)
                .on('click', downloadBinData)
    }

    var legend = svgHisto.selectAll(".legend")
            .data(binsList)
            .enter()
            .append("g")
    
        legend.append("rect")
            .attr("fill", function(d,i) {return etymologyList[i].color})
            .attr("width", 20)
            .attr("height", 20)
            .attr("y", function(d,i) {return i * 30})
            .attr("x", chartWidth - 200);
    
        legend.append("text")
            .attr("class", "label")
            .attr("y", function(d,i) {return 16 + i * 30})
            .attr("x", chartWidth - 170)
            .attr("text-anchor", "start")
            .text(function(d,i) {return etymologyList[i].name});

    // x axis legend
    svgHisto.append('g')
        .append('text')
        .attr('class', 'chartLegend')
        .attr('x', chartWidth/2)
        .attr('y', height - margin.top + 10)
        .attr("text-anchor", "middle")
        .text('Years (by range of 50 years)')

    // y axis legend
    svgHisto.append('g')
        .append('text')
        .attr('class', 'chartLegend')
        .attr("transform", "rotate(-90)")
        // inverted x and y because of rotation (x: height, y: width)
        .attr('y', 0 + 20)
        .attr('x', 0 - height/2)
        .attr("text-anchor", "middle")
        .text(function() {
            if (weightedBool) {return 'Frequency (in %)' }
            else {
                if (occurrencesHistoBool) {return 'Number of occurrences'}
                else {return 'Number of words'}
            }
        })

    // if none of the etymology is selected
    if (etymologySelectedOptionsHisto.length < 1) {
        // do not display tooltips
        d3.selectAll('.tooltip')
            .remove()
        
        d3.selectAll('.rectHisto')
            .on("mouseover", function(d) {
                d3.selectAll('.rectHisto')
                    .style('opacity', 1)
            })

        svgHisto.append('filter')
            .attr('id', 'blur')
            .append('feGaussianBlur')
                .attr('in', 'SourceGraphic')
                .attr('stdDeviation', 3)
        
        svgHisto.selectAll('g')
            .attr('filter', 'url(#blur)')
        
        svgHisto.append('g')
            .append('text')
            .attr('x', width/2)
            .attr('y', height/2)
            .text('Please select at least one etymology')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
    }
}

function showCategoryBarChart() {
    var chapterList = chapterSelectedOptions
    var etymologyList = etymologySelectedOptionsBar

    const categoryData = lexiconData.filter((d) => {
        return chapterList.some((f) => {
            return d[f['chapter_abbrev']] == 1;
        });
    });

    // get the data for each etymology category
    var etymologyBarChartData = []
    etymologyList.forEach(etymology => {
        abbrev = etymology.abbrev
        name = etymology.name
        color = etymology.color

        var barData

        // if the occurrences option is selected
        if (occurrencesBarChartBool) {
            if (abbrev == 'all') {
                var count = d3.sum(categoryData, function(d) {return +d.occurrences})
                barData = categoryData
            } else {
                var filteredData = categoryData.filter(function(d) {return d[abbrev] == 1})
                var count = 0
                chapterList.forEach(chapter => {
                    count = count + d3.sum(filteredData, function(d) {return +d[chapter.chapter_abbrev + '_occurrences']})
                })
                barData = filteredData
            }
        // if the words option is selected
        } else {
            if (abbrev == 'all') {
                var count = categoryData.length
                barData = categoryData
            } else {
                var filteredData = categoryData.filter(function(d) {return d[abbrev] == 1})
                var count = filteredData.length
                //var count = d3.sum(categoryData, function(d) {return +d[abbrev]})
                barData = filteredData
            }
        }
        etymologyBarChartData.push({
            barData,
            count: count,
            label: name,
            color: color,
        })
    })

    // function to sort the bar chart from max to min rect
    function compare(a, b) {
        const countA = a.count
        const countB = b.count
      
        let comparison = 0;
        if (countA > countB) {
          comparison = 1;
        } else if (countA < countB) {
          comparison = -1;
        }
        return comparison * -1;
    }
    etymologyBarChartData.sort(compare)

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
        if (occurrencesBarChartBool) {
            tooltipString = `${d.label}</br>${d.count} occurrences`
        } else {
            tooltipString = `${d.label}</br>${d.count} words`
        }
        tooltip
            .style('visibility', 'visible')
            .html(tooltipString)
        d3.selectAll('.rectBar')
            .style('opacity', 0.6)
        d3.select(this)
            .style("stroke", "black")
            .style('stroke-width', '1px')
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
        d3.selectAll('.rectBar')
            .style('opacity', 1)
        d3.select(this)
            .style("stroke", 'none')
            .style("opacity", 1)
    }

    var downloadBarData = function(d) {
        if (confirm(`Download the list of words of ${d.label} for ${chapterList.length} poems as .csv?`)) {
            let csv = '';
            let header = Object.keys(d.barData[0]).join(',');
            let values = d.barData.map(o => Object.values(o).join(',')).join('\n');
            var filename = `list_${d.label}_${chapterList.length}_poems`

            csv += header + '\n' + values;
            downloadCSV(csv, filename)   
        }
    }

    // initialize chart variables
    var chartHeight = height - margin.bottom
    var chartWidth = width - margin.right
    var duration = 800
    var delay = 200
    var yMax = d3.max(etymologyBarChartData, function(d) {return +d.count})

    // remove previously drawn bar chart elements
    d3.selectAll('#categoryBarChart > svg > g')
        .remove()

    // create vertical scale
    const y = d3.scaleLinear()
        .domain([0, yMax])
        .range([chartHeight, margin.top])
        .interpolate(d3.interpolateRound)

    // create horizontal scale
    const x = d3.scaleBand()
        .domain(etymologyBarChartData.map(d => d.label))
        .range([margin.left, chartWidth])
        .padding(0.1)
        .round(true)

    // add the bar rectangles to the svg element
    svgBarChart.append('g')
        .selectAll('rect')
        .data(etymologyBarChartData)
        .enter()
        .append('rect')
            .attr('class', 'rectBar')
            .attr('height', chartHeight - y(0))
            .attr('width', x.bandwidth())
            .attr('y', y(0))
            .attr('x', d => x(d.label))
            .style('fill', d=> d.color)
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip)
            .on('click', downloadBarData)


    // add x axis. If there are more than 6 bars, do not display ticks
    if (etymologyList.length < 7) {
        svgBarChart.append('g')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x))
    } else {
        svgBarChart.append('g')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x).tickValues([]))
    }

    // add y axis
    if (yMax > 10000) {
        svgBarChart.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(5, "s"))
    } else {
        svgBarChart.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y))
    }
    
    // animation of bars
    svgBarChart.selectAll('.rectBar')
        .transition()
        .duration(duration)
        .attr("y", function(d) {return y(d.count);})
        .attr("height", function(d) {return chartHeight - y(d.count);})
        .delay((d,i) => {return(i*delay)})

    // add titles over bars if there are max. 10 bars
    if (etymologyList.length <= 10) {
        svgBarChart.append('g')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${x.bandwidth() / 2}, 10)`)
        .selectAll('text')
        .data(etymologyBarChartData)
        .enter()
        .append('text')
            .attr('class', 'textBar')
            .style('fill', 'black')
            .attr('fill-opacity', 0)
            .attr('y', d => y(d.count))
            .attr('x', d => x(d.label))
            .attr('dy', '-0.9em')
            .text(d => d.count)
            .transition()
                .duration(duration)
                .delay((d,i) => {return(i*delay + duration)})
                .attr('fill-opacity', 1)
    }
    
    // y axis legend
    svgBarChart.append('g')
        .append('text')
        .attr('class', 'chartLegend')
        .attr("transform", "rotate(-90)")
        // inverted x and y because of rotation (x: height, y: width)
        .attr('y', 0 + 20)
        .attr('x', 0 - height/2)
        .attr("text-anchor", "middle")
        .text(function() {
            if (occurrencesBarChartBool) {return 'Number of occurrences'}
            else {return 'Number of words'}
        })

    // if none of the selectable options is selected
    if (chapterSelectedOptions.length < 1 || etymologySelectedOptionsBar.length < 1) {
        // remove bar and text from chart
        svgBarChart.selectAll('.textBar')
            .remove()
        svgBarChart.selectAll('.rectBar')
            .remove()
        
        // create the blur effect
        svgBarChart.append('filter')
            .attr('id', 'blur')
            .append('feGaussianBlur')
                .attr('in', 'SourceGraphic')
                .attr('stdDeviation', 3)
        
        // apply the blur effect to all elements of the bar chart SVG
        svgBarChart.selectAll('g')
            .attr('filter', 'url(#blur)')
        
        // display a warning message on top of the chart
        svgBarChart.append('g')
            .append('text')
            .attr('x', width/2)
            .attr('y', height/2)
            .text('Please select at least one chapter and one etymology')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
    }
}

function showYearScatterPlot() {
    var chapterAbbrev = chapterSelectedOptionScatter[0]['chapter_abbrev']
    var chapterTitle = chapterSelectedOptionScatter[0]['chapter_title']

    // initialize chart variables
    var chartHeight = height - margin.bottom
    var chartWidth = width - margin.right
    console.log(chartHeight, chartWidth)
    console.log(margin.left, margin.right, margin.top, margin.bottom)

    var chapterTextData = allChaptersTextData.filter(function(d) {return d['text_name'] == chapterAbbrev})
    var filteredChapterTextData = chapterTextData.filter(function(d) {return d['french_etymology'] == 1})
    console.log(filteredChapterTextData.length)

    var yearScatterPlotData = []
    filteredChapterTextData.forEach(word => {
        var idInText = word['id_in_text']
        var lexiconWord = word['lexicon_word']
        var lineMin = word['line_number_min']
        var lineMax = word['line_number_max']

        if (compositionYearBool) {
            if (word['year_2_from'] > 0) {
                var yearFrom = word['year_2_from']
                var yearTo = word['year_2_to']
            } else {
                var yearFrom = word['year_1_from']
                var yearTo = word['year_1_to']
            }
        } else {
            var yearFrom = word['year_1_from']
            var yearTo = word['year_1_to']
        }

        yearScatterPlotData.push({
            idInText: idInText,
            lexiconWord: lexiconWord,
            yearFrom: yearFrom,
            yearTo: yearTo,
            lineMin: lineMin,
            lineMax: lineMax,
        })
    })
    
    yearScatterPlotData = yearScatterPlotData.filter(function(d) {return d.yearFrom > 0})

    var xMax = d3.max(yearScatterPlotData, function(d) {return +d.idInText})
    var yMax = d3.max(yearScatterPlotData, function(d) {return +d.yearTo})
    var yMin = d3.min(yearScatterPlotData, function(d) {return +d.yearFrom})
    console.log(xMax, yMin, yMax)

    // create info bubble to display info when overing mouse on ticks
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
        var tooltipString = `Word: ${d.lexiconWord}<br>Earliest citation: ${d.yearFrom}-${d.yearTo}<br>Lines in text: ${d.lineMin}-${d.lineMax}`
        
        tooltip
            .style('visibility', 'visible')
            .html(tooltipString)
        d3.selectAll('.rectScatter')
            .style('opacity', 0.6)
        d3.select(this)
            .style("stroke", "black")
            .style('stroke-width', '1px')
            .style('stroke-opacity', 0)
            .style("opacity", 1)
            .style('z-index', '10')
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
        d3.selectAll('.rectScatter')
            .style('opacity', 1)
        d3.select(this)
            .style("stroke", 'none')
            .style("opacity", 1)
    }

    // remove previously drawn bar chart elements
    d3.selectAll('#yearScatterPlot > svg > g')
        .remove()

    // create horizontal scale
    var x = d3.scaleLinear()
        .domain([0 - xMax*0.01, xMax*1.01])
        .range([margin.left, chartWidth]);

    // create vertical scale
    var y = d3.scaleLinear()
        .domain([yMin-25, yMax])
        .range([chartHeight, margin.top])
        .interpolate(d3.interpolateRound);

    var xAxis = svgScatter.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x));
    
    var yAxis = svgScatter.append("g")
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    svgScatter.append("defs")
        .append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
                .attr("width", chartWidth - margin.left)
                .attr("height", chartHeight)
                .attr("x", margin.left)
                .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = svgScatter.append('g')
        .attr("clip-path", "url(#clip)")

    // Add dots
    //svgScatter.append('g')
    scatter
        .selectAll("dot")
        .data(yearScatterPlotData)
        .enter()
        .append("rect")
            .attr('class', 'rectScatter')
            .attr("x", function (d) { return x(d.idInText); } )
            .attr("y", function (d) { return y(d.yearTo)} )
            .attr('height', function(d) {
                if (d.yearFrom == d.yearTo) {return 3}
                else {return y(d.yearFrom) - y(d.yearTo)}
            })
            .attr("width", 1)
            .style("fill", "rgb(225, 87, 89)")
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip)

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 10])  // This control how much you can unzoom (1) and zoom (x20)
        .translateExtent([[0, 0], [chartWidth + margin.right, chartHeight + margin.bottom]])
        .on("zoom", updateChart)

    svgScatter
        .call(zoom)
        //.on("mousedown.zoom", null)

    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart() {

        // recover the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);

        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))

        // get the domain coordinates to find the level of zooming, to increase gradually width of bars
        xDomain = d3.extent(x.domain())
        yDomain = d3.extent(y.domain())
        newXDomain = d3.extent(newX.domain())
        newYDomain = d3.extent(newY.domain())

        xWidth = xDomain[1] - xDomain[0]
        yHeight = yDomain[1] - yDomain[0]
        newXWidth = newXDomain[1] - newXDomain[0]
        newYHeight = newYDomain[1] - newYDomain[0]

        zoomMagnification = xWidth / newXWidth

        // update bars position
        scatter.selectAll("rect")
            .attr("x", function (d) { return newX(d.idInText); } )
            .attr("y", function (d) { return newY(d.yearTo)} )
            .attr('height', function(d) {
                if (d.yearFrom == d.yearTo) {return 3}
                else {return newY(d.yearFrom) - newY(d.yearTo)}
            })
            .attr('width', 1 + (0.5 * zoomMagnification - 0.5) )
    }

    // x axis legend
    svgScatter.append('g')
        .append('text')
        .attr('class', 'chartLegend')
        .attr('x', chartWidth/2)
        .attr('y', height - margin.top + 10)
        .attr("text-anchor", "middle")
        .text('Word position in the poem')

    // y axis legend
    svgScatter.append('g')
        .append('text')
        .attr('class', 'chartLegend')
        .attr("transform", "rotate(-90)")
        // inverted x and y because of rotation (x: height, y: width)
        .attr('y', 0 + 20)
        .attr('x', 0 - height/2)
        .attr("text-anchor", "middle")
        .text(function() {
            if (compositionYearBool) {return 'Year of composition' }
            else {return 'Year of manuscript'}
        })
}

function downloadCSV(csvString, filename) {
    var blob = new Blob([csvString]);

    if (window.navigator.msSaveOrOpenBlob){
        window.navigator.msSaveBlob(blob, filename + ".csv");
    } else {
        var a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob, {
            type: "text/plain"
        });
        a.download = filename + ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

function displaySearchResult() {
    var searchValue = document.getElementById("searchWord").value
    // if a non-empty string has been submitted
    if (searchValue) {
        var existingResult = true
        // make the DIV where the search result appears visible
        var x = document.getElementById("searchResult")
        if (x.style.display === 'none') {
            x.style.display = 'block'
            existingResult = false
        }
        // search the string in the lexicon
        lexiconEntry = searchWordInLexicon(searchValue)
        // if the string exists in lexicon
        if (lexiconEntry != undefined) {
            // get the data from lexicon entry
            entryData = getEntryData(lexiconEntry)
            // display the search result
            document.getElementById("searchResult").innerHTML = 
                "<table id='tableResults'>" +
                    "<tr id='tableData'>" +
                        "<td>" + entryData.lexiconWord + "</td>" +
                        "<td>" + entryData.yearRange + "</td>" +
                        "<td>" + entryData.wordEtymology + "</td>" +
                        "<td>" + entryData.occurrences + "</td>" +
                        "<td>" + entryData.wordNbrChapters + "</td>" +
                        "<td><a href=" + entryData.medLink + " target='_blank'>" + entryData.medWord + "</td>" +
                    "</tr>" +
                    "<tr id='tableLegend'>" +
                        "<td>Word</td>" +
                        "<td>Year range</td>" +
                        "<td>Etymology</td>" +
                        "<td>Occurrences</td>" +
                        "<td>Poems</td>" +
                        "<td>MED entry</td>" +
                    "</tr>" +
                "</table>"
            showChapterPie()
        } else {
            // display a message when searched word is not in the lexicon
            document.getElementById("searchResult").innerHTML = "Please enter a word used in Auchinleck Manuscript"
            d3.select('#svgPie').style('display', 'none')
            d3.select('#svgLolli').style('display', 'none')
            d3.select('#note3').style('display', 'none')
        }
    } else {
        // hide the DIV where the search result appears
        var x = document.getElementById("searchResult")
        if (x.style.display === 'block') {
            x.style.display = 'none'
        }
        d3.select('#svgPie').style('display', 'none')
        d3.select('#svgLolli').style('display', 'none')
        d3.select('#note3').style('display', 'none')
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

function getStopWords() {
    mappedData = lexiconData.map(entry => ({
        word: entry.lexicon_word,
        occurrences: entry.occurrences,
        nbr_texts: entry.nbr_texts,
    }))

    mappedData.sort(function(a, b) {
        return b.occurrences - a.occurrences
    })
    
    topWords = mappedData.slice(0, 100)
    topWordsFiltered = topWords.filter(function(d) {return d.nbr_texts >= 40})
    
    stopWordsArray = []
    topWordsFiltered.forEach(entry => {
        stopWordsArray.push(entry.word)
    })
    
    return stopWordsArray
}

function getEntryData(lexiconEntry) {
    // get the word form, year range, MED word, web link to the MED entry, and etymology of the lexicon entry
    lexiconWord = '<span id="resultWord">' + lexiconEntry.lexicon_word + '</span>'
    yearRange = '<span id="resultYearFrom">' + lexiconEntry.earliest_year_from + '</span>' + " - " + '<span id="resultYearTo">' + entry.earliest_year_to + '</span>'
    occurrences = '<span id="">' + lexiconEntry.occurrences_manuscript + '</span'
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
        if (wordNbrChapters > 1) {
            wordChapters = wordNbrChapters + " chapters"
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
        occurrences: occurrences,
        wordEtymology: wordEtymology,
        wordChapters: wordChapters,
        wordNbrChapters: wordNbrChapters,
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
                // simulate a click on the search button
                document.getElementById("searchButton").click();
            }
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
