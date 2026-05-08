// @todo: напишите здесь код парсера

function parsePage() {
  //meta
  const lang = document.querySelector("html").getAttribute("lang");
  const title = document
    .querySelector("title")
    .textContent.split("—")[0]
    .trim();
  const description = document
    .querySelector("meta[name = 'description']")
    .getAttribute("content");

  const keywords = document
    .querySelector("meta[name = 'keywords']")
    .getAttribute("content")
    .split(",")
    .map((el) => el.trim());

  const ogData = {};
  const ogTags = document.querySelectorAll("meta[property^='og:']");
  ogTags.forEach((el) => {
    const key = el.getAttribute("property").replace("og:", "");
    let value = el.getAttribute("content");
    if (key === "title") value = value.split("—")[0].trim();
    ogData[key] = value;
  });

  //product
  const productID = document.querySelector("section").dataset.id;
  const images = [...document.querySelectorAll("nav button img")].map((img) => {
    return {
      preview: img.src,
      full: img.dataset.src,
      alt: img.alt,
    };
  });

  const isLiked =
    document.querySelector("figure button")?.classList.contains("active") ||
    false;
  const name = document.querySelector("h1").textContent;
  const tags = { category: [], discount: [], label: [] };
  const birk = [...document.querySelector(".tags").children].forEach((e) => {
    if (e.classList.contains("green")) {
      tags.category.push(e.textContent.trim());
    }
    if (e.classList.contains("blue")) {
      tags.label.push(e.textContent.trim());
    }
    if (e.classList.contains("red")) {
      tags.discount.push(e.textContent.trim());
    }
  });
  const oldPrice = Number(
    document.querySelector(".price span").textContent.replace(/\D/g, "").trim(),
  );

  const price = Number(
    document
      .querySelector(".price")
      .textContent.trim()
      .split(/\s+/)[0]
      .replace(/\D/g, ""),
  );
  const discount = oldPrice - price;
  const discountPercent =
    oldPrice > price
      ? (((oldPrice - price) / oldPrice) * 100).toFixed(2) + "%"
      : "0%";

  let currency = "RUB";
  if (document.querySelector(".price").textContent.includes("$"))
    currency = "USD";
  else if (document.querySelector(".price").textContent.includes("€"))
    currency = "EUR";
  const descrTitle = document.querySelector(".description h3");
  descrTitle.removeAttribute("class");
  const descrip = document.querySelector(".description").innerHTML.trim();

  const properties = {};
  const arrKeyValue = [...document.querySelectorAll(".properties li")];
  arrKeyValue.forEach((el) => {
    const parts = el.textContent.trim().split(/\s+/);
    properties[parts[0]] = parts[1];
  });

  //suggested

  const arrSuggested = [...document.querySelectorAll(".suggested article")].map(
    (el) => {
      const sugName = el.querySelector("h3").textContent;
      const sugImg = el.querySelector("img").getAttribute("src");
      const sugDescr = el.querySelector("p").textContent;
      const sugPrice = el.querySelector("b").textContent.replace(/\D/g, "");

      let sugCurrency = "RUB";
      if (el.querySelector("b").textContent.includes("$")) sugCurrency = "USD";
      else if (el.querySelector("b").textContent.includes("€"))
        sugCurrency = "EUR";
      return {
        name: sugName,
        description: sugDescr,
        image: sugImg,
        price: sugPrice,
        currency: sugCurrency,
      };
    },
  );
  console.log(arrSuggested);

  const reviews = [...document.querySelectorAll(".reviews article")].map(
    (el) => {
      const rating = el.querySelectorAll(".rating .filled").length;
      const reviewsTitle = el.querySelector(".title").textContent;
      const reviewsDesc = el.querySelector("p").textContent;
      const reviewsDate = el
        .querySelector("i")
        .textContent.replaceAll("/", ".");
      const authorEl = el.querySelector(".author");
      const author = {
        avatar: authorEl.querySelector("img").getAttribute("src"),
        name: authorEl.querySelector("span").textContent.trim(),
      };
      return {
        rating: rating,
        author: author,
        title: reviewsTitle,
        description: reviewsDesc,
        date: reviewsDate,
      };
    },
  );

  return {
    meta: {
      title: title,
      description: description,
      keywords: keywords,
      language: lang,
      opengraph: ogData,
    },
    product: {
      id: productID,
      name: name,
      isLiked: isLiked,
      tags: tags,
      price: price,
      oldPrice: oldPrice,
      discount: discount,
      discountPercent: discountPercent,
      currency: currency,
      properties: properties,
      description: descrip,
      images: images,
    },
    suggested: arrSuggested,
    reviews: reviews,
  };
}

window.parsePage = parsePage;
