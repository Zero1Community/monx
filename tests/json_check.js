/**
 * Created by daci.14 on 1/9/2016.
 */
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function hasKeys(str, keys) {
    keys.forEach(function (el) {
        if (str.hasOwnProperty(el)) {
            console.log('Key ' + el + ' exists');
            if (str[el] == '') {
                console.log('Key ' + el + ' does not contain data');
            }
        }
        else {
            return false;
        }
    })
    console.log('Keys look ok');
    return true;
}

var a = {
    mondi: 'jari',
    boti: '',
    laje: 'o gzim',
    eeee: ''
};

if (hasKeys(a, ['mondi', 'boti', 'laje'])) {
    console.log('OK');
}
else {
    console.log('NUK I KA');
}