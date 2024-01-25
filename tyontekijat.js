const express = require('express');

const {port, host} = require('./config.json');
const tyontekijat = require('./tyontekijat.json');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apufunktiot
newId = () => {
  let max = 0;
  for (let henkilo of tyontekijat) {
    if (henkilo.id > max) {
      max = henkilo.id;
    }
  }

  return max + 1;
};

// Määritellään polut
app.get('/tyontekijat', (req, res) => {
  res.json(tyontekijat);
});

app.get('/tyontekijat/:id', (req, res) => {
  const tyontekija = [];
  const haettava =  Number.parseInt(req.params.id);

  for (let henkilo of tyontekijat) {
      if (henkilo.id === haettava) {
          tyontekija.push(henkilo);
      }
  }

  res.json(tyontekija);
});

/* tai sama filterillä
app.get('/tyontekijat/:id', (req, res) => {
  const haettava = req.params.id;
  const tulos = tyontekijat.filter((henkilo) => henkilo.id == haettava);
  res.json(tulos);
});
*/

app.post('/tyontekijat/uusi', (req, res) => {
  // kerätään tiedot pyynnön body-osasta
  const etunimi = req.body.etunimi;
  const sukunimi = req.body.sukunimi;
  const yritys = req.body.yritys;
  const osasto = req.body.osasto;
  const kaupunki = req.body.kaupunki;

  // jos kaikkia tietoja ei ole annettu, ilmoitetaan virheestä
  // (muuttuja saa arvon undefined, jos vastaavaa elementtiä
  // ei ollut pyynnössä)
  if (etunimi == undefined ||
      sukunimi == undefined ||
      yritys == undefined ||
      osasto == undefined ||
      kaupunki == undefined) {
      res.status(400).json({'viesti': 'Virhe: Kaikkia tietoja ei annettu.'});
  }
  else {
      // luodaan tiedoilla uusi olio
      const uusi = {
          id: newId(),
          etunimi: etunimi,
          sukunimi: sukunimi,
          yritys: yritys,
          osasto: osasto,
          kaupunki: kaupunki
      };

      // lisätään olio työntekijöiden taulukkoon
      tyontekijat.push(uusi);

      // lähetetään onnistumisviesti
      res.json(uusi);
  }
});

app.put('/tyontekijat/:id', (req, res) => {
  const id =  Number.parseInt(req.params.id);
  // kerätään tiedot pyynnön body-osasta
  const etunimi = req.body.etunimi;
  const sukunimi = req.body.sukunimi;
  const yritys = req.body.yritys;
  const osasto = req.body.osasto;
  const kaupunki = req.body.kaupunki;

  // jos kaikkia tietoja ei ole annettu, ilmoitetaan virheestä
  // (muuttuja saa arvon undefined, jos vastaavaa elementtiä
  // ei ollut pyynnössä)
  if (
    id == undefined ||
    etunimi == undefined ||
    sukunimi == undefined ||
    yritys == undefined ||
    osasto == undefined ||
    kaupunki == undefined
  ) {
    res.status(400).json({'viesti': 'Virhe: Kaikkia tietoja ei annettu.'});
  }
  else {
    let onOlemassa = false;
    let uusi = {};

    // Etsitään muokattava henkilö ja muokataan arvot
    for (let henkilo of tyontekijat) {
      if (henkilo.id == id) {
        henkilo.etunimi = etunimi;
        henkilo.sukunimi = sukunimi;
        henkilo.yritys = yritys;
        henkilo.osasto = osasto;
        henkilo.kaupunki = kaupunki;

        onOlemassa = true;

        uusi = {
          id: id,
          etunimi: etunimi,
          sukunimi: sukunimi,
          yritys: yritys,
          osasto: osasto,
          kaupunki: kaupunki
        };
      }
    }

    // Tarkistetaan onnistuiko muokkaaminen
    if (!onOlemassa) {
      res.status(400).json({"viesti": "Virhe: Tuntematon henkilö."});
    }
    else {
      // lähetetään onnistumisviesti
      res.json(uusi);
    }
  }
});



// Käynnistetään express-palvelin
app.listen(port, host, () => {console.log('Kuuntelee')});
