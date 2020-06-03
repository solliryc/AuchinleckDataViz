var lexicon_array = []

d3.csv('../data/test_lexicon.csv', function(d){
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
});