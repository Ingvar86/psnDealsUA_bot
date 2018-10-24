const request = require('request');

const filterDeals = (deals) => {
  let array = deals.included.filter(deal => deal.type === 'game' && deal.attributes.skus.find(x => x.prices['non-plus-user']['strikethrough-price']));
  array = array.map((deal) => {
    const { prices } = deal.attributes.skus.find(x => x.prices['non-plus-user']['strikethrough-price']);
    return { _id: deal.id, name: deal.attributes.name.replace(/[™®]/g, ''), prices };
  });
  return array;
};

const _getDeals = (start, size) => {
  const apiUrl = `https://store.playstation.com/valkyrie-api/ru/UA/19/container/STORE-MSF75508-PRICEDROPSCHI?platform=ps4&game_content_type=games,bundles&size=${size}&bucket=games&start=${start}`;
  return new Promise((resolve, reject) => {
    request.get(apiUrl, (error, response, body) => {
      if (!error) {
        let json;
        try {
          json = JSON.parse(body);          
          resolve(filterDeals(json));
        }
        catch (error) {
          console.log(body);
          reject(error);
        }
      } else {
        reject(error);
      }
    });
  });
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getDeals = async () => {
  let deals = [];
  let i = 0;
  const size = 100;
  let array = [];
  do {
    array = await _getDeals(i, size);
    await sleep(3000);
    deals = deals.concat(array);
    i += size;
  }
  while (array.length > 0);
  return deals;
};
