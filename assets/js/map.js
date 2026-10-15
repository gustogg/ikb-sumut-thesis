(() => {
  "use strict";

  const mapElement = document.getElementById("ikbs-map");
  const statusElement = document.getElementById("map-status");
  const configElement = document.getElementById("ikbs-map-config");

  if (!mapElement) {
    return;
  }

  const showStatus = (message) => {
    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
    statusElement.classList.remove("hidden");
  };

  const hideStatus = () => {
    statusElement?.classList.add("hidden");
  };

  if (typeof window.L === "undefined") {
    showStatus("Leaflet gagal dimuat.");
    return;
  }

  const tileUrl = mapElement.dataset.tileUrl;
  const attribution = mapElement.dataset.attribution;

  if (!tileUrl || !attribution || !configElement) {
    showStatus("Konfigurasi peta belum lengkap.");
    return;
  }

  let config;

  try {
    config = JSON.parse(configElement.textContent || "{}");
  } catch (error) {
    console.error("[IKBS] Konfigurasi peta tidak valid.", error);
    showStatus("Konfigurasi data peta tidak valid.");
    return;
  }

  if (
    !config.geojsonUrl ||
    !config.layer ||
    !Array.isArray(config.regions)
  ) {
    showStatus("Konfigurasi data wilayah belum lengkap.");
    return;
  }

  const regionByCode = new Map(
    config.regions.map((region) => [String(region.code).trim(), region])
  );

  const levelColors = {
    very_low: "#16a34a",
    low: "#84cc16",
    medium: "#eab308",
    high: "#f97316",
    very_high: "#dc2626",
  };

  const emptyColor = "#64748b";

  const map = window.L.map(mapElement, {
    zoomControl: true,
    minZoom: 5,
    maxZoom: 18,
  });

  const northSumatraBounds = window.L.latLngBounds(
    [-0.8, 96.7],
    [4.6, 101.0]
  );

  map.fitBounds(northSumatraBounds, {
    padding: [20, 20],
  });

  const tileLayer = window.L.tileLayer(tileUrl, {
    minZoom: 5,
    maxZoom: 19,
    attribution,
    updateWhenIdle: true,
  });

  tileLayer.addTo(map);

  window.L.control
    .scale({
      imperial: false,
      metric: true,
    })
    .addTo(map);

  let boundaryLayer = null;
  let boundaryReady = false;
  let tileFailed = false;

  tileLayer.once("load", () => {
    if (boundaryReady && !tileFailed) {
      hideStatus();
    }
  });

  tileLayer.on("tileerror", () => {
    tileFailed = true;
    showStatus(
      "Sebagian peta dasar gagal dimuat. Batas wilayah tetap dapat digunakan."
    );
  });

  const normalizeCode = (value) => String(value ?? "").trim();

  const getRegionRecord = (feature) => {
    const code = normalizeCode(feature?.properties?.kdpkab);

    return {
      code,
      record: regionByCode.get(code) ?? null,
    };
  };

  const getRegionName = (feature, record) => {
    const sourceName = String(
      record?.name || feature?.properties?.wadmkk || "Wilayah tidak dikenal"
    ).trim();

    if (
      record?.administrative_type === "kabupaten" &&
      !sourceName.toLowerCase().startsWith("kabupaten ")
    ) {
      return `Kabupaten ${sourceName}`;
    }

    if (
      record?.administrative_type === "kota" &&
      !sourceName.toLowerCase().startsWith("kota ")
    ) {
      return `Kota ${sourceName}`;
    }

    return sourceName;
  };

  const getLevelColor = (record) =>
    levelColors[record?.level_code] ?? emptyColor;

  const isDarkMode = () =>
    document.documentElement.classList.contains("dark");

  const getFeatureStyle = (feature) => {
    const { record } = getRegionRecord(feature);
    const hasStatus = Boolean(record?.level_code);

    return {
      color: isDarkMode() ? "#cbd5e1" : "#475569",
      weight: 1.1,
      opacity: 0.9,
      fillColor: getLevelColor(record),
      fillOpacity: hasStatus ? 0.64 : 0.22,
    };
  };

  const formatVariableValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Belum tersedia";
    }

    const variable = config.layer.variable || {
      decimalPlaces: config.layer.type === "overall" ? 2 : 4,
      displayType: "decimal",
      unit: null,
    };
    const numericValue = Number(value);

    if (!variable || !Number.isFinite(numericValue)) {
      return String(value);
    }

    const rawDecimalPlaces = variable.decimalPlaces == null
      ? 6
      : Number(variable.decimalPlaces);
    const decimalPlaces = Number.isInteger(rawDecimalPlaces)
      ? Math.max(0, Math.min(6, rawDecimalPlaces))
      : 6;

    const minimumFractionDigits =
      variable.displayType === "percentage" ? decimalPlaces : 0;

    const formatted = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits,
      maximumFractionDigits: decimalPlaces,
    }).format(numericValue);

    if (variable.unit === "%") {
      return `${formatted}%`;
    }

    if (variable.unit) {
      return `${formatted} ${variable.unit}`;
    }

    return formatted;
  };

  const appendDetail = (list, label, value) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    row.className = "ikbs-map-popup__row";
    term.textContent = label;
    description.textContent = value;

    row.append(term, description);
    list.append(row);
  };

  const createPopupContent = (feature, code, record) => {
    const content = document.createElement("article");
    const eyebrow = document.createElement("p");
    const heading = document.createElement("h3");
    const status = document.createElement("span");
    const details = document.createElement("dl");

    content.className = "ikbs-map-popup";
    eyebrow.className = "ikbs-map-popup__eyebrow";
    heading.className = "ikbs-map-popup__title";
    status.className = "ikbs-map-popup__status";
    details.className = "ikbs-map-popup__details";

    eyebrow.textContent = record?.administrative_type === "kota"
      ? "Kota"
      : "Kabupaten";
    heading.textContent = getRegionName(feature, record);
    status.textContent = record?.level_label || "Belum tersedia";
    status.style.backgroundColor = getLevelColor(record);
    status.style.color = "#ffffff";

    appendDetail(details, "Layer", config.layer.name);

    if (record?.area_km2 != null) {
      const area = Number(record.area_km2);

      if (Number.isFinite(area)) {
        appendDetail(details, "Luas Wilayah BIG", `${new Intl.NumberFormat("id-ID", {
          maximumFractionDigits: 6,
        }).format(area)} km²`);
      }
    }

    appendDetail(
      details,
      config.layer.type === "variable" ? "Nilai" : "Indeks",
      formatVariableValue(record?.value ?? null)
    );

    if (config.layer.type === "overall" && Number.isInteger(record?.source_rank)) {
      appendDetail(details, "Peringkat", `${record.source_rank} dari ${config.regions.length}`);
    }

    if (record?.note) {
      appendDetail(details, "Catatan", record.note);
    }

    content.append(eyebrow, heading, status, details);

    return content;
  };

  const addKeyboardSupport = (layer, label) => {
    layer.once("add", () => {
      const element = layer.getElement?.();

      if (!element) {
        return;
      }

      element.setAttribute("tabindex", "0");
      element.setAttribute("role", "button");
      element.setAttribute("aria-label", `${label}. Buka detail wilayah.`);

      element.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        layer.openPopup();
      });
    });
  };

  const onEachFeature = (feature, layer) => {
    const { code, record } = getRegionRecord(feature);
    const regionName = getRegionName(feature, record);

    layer.bindTooltip(regionName, {
      direction: "top",
      sticky: true,
    });

    layer.bindPopup(createPopupContent(feature, code, record), {
      maxWidth: 320,
    });

    layer.on({
      mouseover(event) {
        event.target.setStyle({
          weight: 2.5,
          fillOpacity: record?.level_code ? 0.82 : 0.38,
        });

        event.target.bringToFront?.();
      },
      mouseout(event) {
        boundaryLayer?.resetStyle(event.target);
      },
    });

    addKeyboardSupport(layer, regionName);
  };

  const addLegend = () => {
    const classification = config.layer.classification;
    const items = Array.isArray(classification?.classes)
      ? classification.classes.map((item) => ({ ...item }))
      : [];

    if (config.regions.some((region) => !region.level_code)) {
      items.push({ code: null, label: "Belum tersedia" });
    }

    const legend = window.L.control({
      position: "bottomright",
    });

    legend.onAdd = () => {
      const container = window.L.DomUtil.create(
        "div",
        "ikbs-map-legend"
      );
      const title = document.createElement("p");

      title.className = "ikbs-map-legend__title";
      title.textContent = classification?.title || "Kategori";
      container.append(title);

      items.forEach(({ code, label, lower, upper, lower_inclusive: lowerInclusive }) => {
        const item = document.createElement("div");
        const swatch = document.createElement("span");
        const text = document.createElement("span");

        item.className = "ikbs-map-legend__item";
        swatch.className = "ikbs-map-legend__swatch";
        swatch.style.backgroundColor = code
          ? levelColors[code]
          : emptyColor;
        text.textContent = label;

        if (
          classification?.method === "jenks"
          && upper != null
          && Number.isFinite(Number(upper))
        ) {
          const range = document.createElement("small");
          const formatBreak = (value) => new Intl.NumberFormat("id-ID", {
            maximumFractionDigits: 6,
          }).format(Number(value));
          range.style.display = "block";
          range.textContent = lowerInclusive || !Number.isFinite(Number(lower))
            ? `≤ ${formatBreak(upper)}`
            : `> ${formatBreak(lower)} – ≤ ${formatBreak(upper)}`;
          text.append(range);
        }

        item.append(swatch, text);
        container.append(item);
      });

      window.L.DomEvent.disableClickPropagation(container);
      window.L.DomEvent.disableScrollPropagation(container);

      return container;
    };

    legend.addTo(map);
  };

  addLegend();

  fetch(config.geojsonUrl, {
    headers: {
      Accept: "application/geo+json, application/json",
    },
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    })
    .then((geojson) => {
      if (
        geojson?.type !== "FeatureCollection" ||
        !Array.isArray(geojson.features)
      ) {
        throw new Error("Struktur GeoJSON tidak valid.");
      }

      boundaryLayer = window.L.geoJSON(geojson, {
        style: getFeatureStyle,
        onEachFeature,
      }).addTo(map);

      const bounds = boundaryLayer.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [18, 18],
        });
      }

      boundaryReady = true;

      if (!tileFailed) {
        hideStatus();
      }
    })
    .catch((error) => {
      console.error("[IKBS] Batas wilayah gagal dimuat.", error);
      showStatus(
        "Batas kabupaten/kota gagal dimuat. Muat ulang halaman untuk mencoba kembali."
      );
    });

  const themeObserver = new MutationObserver(() => {
    boundaryLayer?.setStyle(getFeatureStyle);
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener("load", () => {
    map.invalidateSize();
  });
})();
