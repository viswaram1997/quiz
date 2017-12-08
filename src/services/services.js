export default async function dataFetch(){
    var result = await fetch("https://script.google.com/macros/s/AKfycbyUCfLEsry2RpTDgrxjDoesRzzRK4ej_5GVGebrHiTRLTIjzAE/exec")
                        .then(res=>{ return res.json()});
    return result;
}