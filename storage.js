function save(data) {
    let updated_dict = {
        ...data
    };
    $.each(data, function (index, year) {
        if (!Number.isNaN(parseInt(year))) {
            $.each(year, function (index2, semester) {
                $.each(semester, function (index3, class_name) {
                    $.each(class_name, function (index4, month) {
                        if (!(index4 == 'variables')) {
                            $.each(month, function (index5, day) {
                                if (day == 0) {
                                    delete updated_dict[index][index2][index3][index4][index5];
                                }
                            });
                        }
                    });
                });
            });

        }
    });

    localStorage.setItem('data', JSON.stringify(updated_dict));
}

function update_variable(keyword, value){
    let a_data = load();
    a_data['variables'][keyword] = value;
    data['variables'][keyword] = value;
    save(a_data);
}

function load() {
    return JSON.parse(localStorage.getItem('data'));
} 
function set_default(data, year, semester, a_class, month, day) {
    if (typeof (data) != "undefined") {
        if (typeof (year) != "undefined") {
            if (!(year in data)) {
                data[year] = {};
            }
            if (typeof (semester) != "undefined") {
                if (!(semester in data[year])) {
                    data[year][semester] = {};
                }
                if (typeof (a_class) != "undefined") {
                    if (!(a_class in data[year][semester])) {
                        data[year][semester][a_class] = {
                            'variables': {
                                'Credits': 0,
                                'Duration-current': false,
                                'Difficulty-set': 'easy',
                                'Planned': 0
                            }
                        };
                    } else if (!('variables' in data[year][semester][a_class])) {
                        data[year][semester][a_class]['variables'] = {
                            'Credits': 0,
                            'Duration-current': false,
                            'Planned': 0
                        };
                    }
                    if (typeof (month) != "undefined") {
                        if (!(month in data[year][semester][a_class])) {
                            data[year][semester][a_class][month] = {};
                        }
                        if (typeof (day) != "undefined") {
                            if (!(day in data[year][semester][a_class][month])) {
                                data[year][semester][a_class][month][day] = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
/*
var data = {
    "2020": {
        "Spring": {
            "CIT 260": {
                "1": {},
                "5": {
                    "28": 5400,
                    "29": 1723
                },
                "6": {
                    "3": 5990,
                    "4": 18280,
                    "11": 2383,
                    "12": 12832,
                    "13": 1434,
                    "15": 15174
                },
                "7": {
                    "2": 832,
                    "3": 7632,
                    "4": 13579,
                    "7": 1081,
                    "8": 9530,
                    "9": 2261,
                    "10": 7535,
                    "13": 625,
                    "15": 9401,
                    "17": 7200,
                    "19": 0,
                    "20": 0,
                    "21": 0,
                    "22": 0,
                    "23": 0,
                    "24": 0,
                    "25": 0
                },
                "variables": {
                    "Credits": 3,
                    "Duration-current": false,
                    "Planned": 32400,
                    "Difficulty-set": "medium"
                }
            },
            "CS 241": {
                "1": {},
                "5": {
                    "28": 17220
                },
                "6": {
                    "1": 679,
                    "2": 9641,
                    "3": 7817,
                    "9": 9905,
                    "10": 18259,
                    "11": 19580,
                    "13": 10448,
                    "15": 9137,
                    "17": 6745,
                    "20": 5501
                },
                "7": {
                    "1": 4833,
                    "2": 2058,
                    "3": 14056,
                    "6": 9978,
                    "7": 9435,
                    "8": 309,
                    "9": 5303,
                    "10": 302,
                    "13": 4516,
                    "14": 11630,
                    "15": 6392,
                    "16": 12499,
                    "17": 6972,
                    "18": 12875,
                    "19": 0,
                    "20": 20248,
                    "21": 0,
                    "22": 0,
                    "23": 0,
                    "24": 0,
                    "25": 0
                },
                "variables": {
                    "Credits": 4,
                    "Duration-current": false,
                    "Planned": 28800,
                    "Difficulty-set": "easy"
                }
            },
            "WDD 130": {
                "1": {},
                "5": {
                    "28": 8616
                },
                "6": {
                    "1": 9638,
                    "5": 142,
                    "9": 16774,
                    "13": 12693
                },
                "7": {
                    "4": 7891,
                    "6": 14682,
                    "7": 14038,
                    "13": 265,
                    "19": 0,
                    "20": 0,
                    "21": 6074,
                    "22": 0,
                    "23": 0,
                    "24": 0,
                    "25": 0
                },
                "variables": {
                    "Credits": 2,
                    "Duration-current": true,
                    "Planned": 21600,
                    "Difficulty-set": "medium"
                }
            },
            "REL 122": {
                "1": {},
                "5": {
                    "29": 3757,
                    "30": 20271
                },
                "6": {
                    "1": 5639,
                    "2": 5140,
                    "5": 2820,
                    "8": 9019,
                    "9": 371,
                    "10": 12979,
                    "11": 747,
                    "16": 674
                },
                "7": {
                    "1": 8663,
                    "2": 21864,
                    "3": 7129,
                    "6": 4182,
                    "7": 4339,
                    "9": 4377,
                    "10": 7516,
                    "13": 3739,
                    "19": 0,
                    "20": 773,
                    "21": 936,
                    "22": 0,
                    "23": 0,
                    "24": 0,
                    "25": 0
                },
                "variables": {
                    "Credits": 2,
                    "Duration-current": false,
                    "Planned": 14400,
                    "Difficulty-set": "easy"
                }
            }
        }
    },
    "variables": {
        "current-year": "2020",
        "current-semester": "Spring"
    }
}

*/
