document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('propertyPriceByBoroughChart').getContext('2d');
    const ctxNeighborhood = document.getElementById('topNeighborhoodSalesChart').getContext('2d');
    const ctxAge = document.getElementById('averageBuildingAgeChart').getContext('2d');
    const ctxCategory = document.getElementById('categoryBuildingResidentialUnitsChart').getContext('2d');
    const ctxCommercialCategory = document.getElementById('categoryBuildingCommercialUnitsChart').getContext('2d');
    const ctxTotalUnits = document.getElementById('totalUnitSalesPerMonthChart').getContext('2d');
    let propertyPriceChart;
    let neighborhoodSalesChart;
    let averageBuildingAgeChart;
    let categoryBuildingResidentialUnitsChart;
    let categoryBuildingCommercialUnitsChart;
    let totalUnitSalesPerMonthChart;

    // Inisialisasi peta
    const map = L.map('salesMap').setView([40.7128, -74.0060], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Koordinat untuk setiap borough di New York City
    const boroughCoordinates = {
        'Manhattan': { lat: 40.7831, lng: -73.9712 },
        'Brooklyn': { lat: 40.6782, lng: -73.9442 },
        'Queens': { lat: 40.7282, lng: -73.7949 },
        'Bronx': { lat: 40.8448, lng: -73.8648 },
        'Staten Island': { lat: 40.5795, lng: -74.1502 }
    };

    // Fungsi untuk menambahkan marker untuk setiap borough
    function addBoroughMarkers(selectedBorough = 'BOROUGH') {
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        Object.keys(boroughCoordinates).forEach(borough => {
            if (selectedBorough === 'BOROUGH' || borough === selectedBorough) {
                const coords = boroughCoordinates[borough];
                L.marker([coords.lat, coords.lng]).addTo(map)
                    .bindPopup(`<strong>Borough:</strong> ${borough}`);
            }
        });
    }

    // Memanggil fungsi untuk menambahkan marker borough
    addBoroughMarkers();

    function initSalesMap(data) {
        data.forEach(item => {
            geocodeAddress(item.ADDRESS + ', New York').then(coords => {
                if (coords) {
                    L.marker([coords.lat, coords.lng]).addTo(map)
                        .bindPopup(`${item.ADDRESS}<br>Price: $${item['SALE PRICE']}`);
                }
            });
        });
    }

    function initChart(data) {
        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets.map(dataset => ({
                    ...dataset,
                    borderColor: getCategoryColor(dataset.label) // Use color from categoryColors
                }))
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
        propertyPriceChart = new Chart(ctx, config);
        console.log("Chart initialized with data:", data);
    }

    function initNeighborhoodChart(data) {
        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.totalUnits,
                    backgroundColor: data.colors.map(() => getRandomColor()), // Changed to random color
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Total Units'
                    }
                }
            }
        };
        neighborhoodSalesChart = new Chart(ctxNeighborhood, config);
    }

    function initAverageBuildingAgeChart(data) {
        const colors = data.labels.map(label => getCategoryColor(label)); // Use color from categoryColors
        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.ages,
                    backgroundColor: colors, // Use the same colors for background
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Building Age'
                    }
                }
            }
        };

        averageBuildingAgeChart = new Chart(ctxAge, config);
    }

    // Objek untuk menyimpan warna berdasarkan kategori
    const categoryColors = {};

    function getCategoryColor(category) {
        if (!categoryColors[category]) {
            categoryColors[category] = getRandomColor(); // Jika belum ada, buat warna baru
        }
        return categoryColors[category];
    }

    function initcategoryBuildingResidentialUnitsChart(data) {
        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Residential Units',
                    data: data.units,
                    backgroundColor: data.labels.map(label => getCategoryColor(label)), // Use color from categoryColors object
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Residential Units'
                    }
                }
            }
        };
        categoryBuildingResidentialUnitsChart = new Chart(ctxCategory, config);
    }

    function initCategoryBuildingCommercialUnitsChart(data) {
        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Commercial Units',
                    data: data.units,
                    backgroundColor: data.labels.map(label => getCategoryColor(label)), // Use color from categoryColors object
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Commercial Units'
                    }
                }
            }
        };
        categoryBuildingCommercialUnitsChart = new Chart(ctxCommercialCategory, config);
    }

    function initTotalUnitSalesPerMonthChart(data) {
        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Total Units',
                    data: data.totalUnits,
                    fill: false,
                    borderColor: getRandomColor(), // Changed to random color
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Total Units'
                    }
                }
            }
        };
        totalUnitSalesPerMonthChart = new Chart(ctxTotalUnits, config);
    }

    function updateCategoryBuildingResidentialUnitsChart(data) {
        categoryBuildingResidentialUnitsChart.data.labels = data.labels;
        categoryBuildingResidentialUnitsChart.data.datasets[0].data = data.units;
        categoryBuildingResidentialUnitsChart.data.datasets[0].backgroundColor = data.labels.map(label => getCategoryColor(label)); // Use color from categoryColors object
        categoryBuildingResidentialUnitsChart.update();
    }

    function updateCategoryBuildingCommercialUnitsChart(data) {
        categoryBuildingCommercialUnitsChart.data.labels = data.labels;
        categoryBuildingCommercialUnitsChart.data.datasets[0].data = data.units;
        categoryBuildingCommercialUnitsChart.data.datasets[0].backgroundColor = data.labels.map(label => getCategoryColor(label)); // Use color from categoryColors object
        categoryBuildingCommercialUnitsChart.update();
    }

    function fetchData(borough = 'BOROUGH', category = 'CATEGORY BUILDING', monthYear = 'SALE DATE') {
        return fetch('data.json')
            .then(response => response.json())
            .then(data => {
                let filteredData = data;
                if (borough !== 'BOROUGH') {
                    filteredData = filteredData.filter(item => item.BOROUGH === borough);
                }
                if (category !== 'CATEGORY BUILDING') {
                    filteredData = filteredData.filter(item => item['CATEGORY BUILDING'] === category);
                }
                if (monthYear !== 'SALE DATE') {
                    filteredData = filteredData.filter(item => {
                        const itemDate = new Date(item['SALE DATE']);
                        const itemMonthYear = `${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;
                        return itemMonthYear === monthYear;
                    });
                }

                updateAverageSalePrice(filteredData);
                updateAverageLandSquareFeet(filteredData);
                updateAverageTotalUnits(filteredData);

                const buildingAgeData = groupDataByBuildingAge(filteredData);
                if (!averageBuildingAgeChart) {
                    initAverageBuildingAgeChart(buildingAgeData);
                } else {
                    updateAverageBuildingAgeChart(buildingAgeData);
                }
                const groupedData = groupDataByBoroughAndDate(filteredData);
                if (!propertyPriceChart) {
                    initChart(groupedData);
                } else {
                    updateChart(groupedData);
                }
                const neighborhoodData = groupDataByNeighborhood(filteredData);
                if (!neighborhoodSalesChart) {
                    initNeighborhoodChart(neighborhoodData);
                } else {
                    updateNeighborhoodChart(neighborhoodData);
                }
                const categoryBuildingData = groupDataByCategoryBuilding(filteredData);
                if (!categoryBuildingResidentialUnitsChart) {
                    initcategoryBuildingResidentialUnitsChart(categoryBuildingData);
                } else {
                    updateCategoryBuildingResidentialUnitsChart(categoryBuildingData);
                }
                const categoryBuildingCommercialData = groupDataByCategoryBuildingCommercial(filteredData);
                if (!categoryBuildingCommercialUnitsChart) {
                    initCategoryBuildingCommercialUnitsChart(categoryBuildingCommercialData);
                } else {
                    updateCategoryBuildingCommercialUnitsChart(categoryBuildingCommercialData);
                }
                const totalUnitSalesData = groupDataByMonthAndYear(filteredData);
                if (!totalUnitSalesPerMonthChart) {
                    initTotalUnitSalesPerMonthChart(totalUnitSalesData);
                } else {
                    updateTotalUnitSalesPerMonthChart(totalUnitSalesData);
                }
                initSalesMap(filteredData);
                updateDataTable(filteredData); // Call updateDataTable to fill the table with data
            });
    }

    function updateAverageSalePrice(data) {
        const totalSalePrice = data.reduce((acc, item) => acc + parseFloat(item['SALE PRICE']), 0);
        const averageSalePrice = data.length > 0 ? (totalSalePrice / data.length) : 0;
        document.getElementById('avgSalePriceValue').textContent = formatCurrency(averageSalePrice);
    }

    function updateAverageLandSquareFeet(data) {
        const totalLandSquareFeet = data.reduce((acc, item) => acc + parseFloat(item['LAND SQUARE FEET'] || 0), 0);
        const averageLandSquareFeet = data.length > 0 ? (totalLandSquareFeet / data.length) : 0;
        const formattedAverage = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(averageLandSquareFeet);
        document.getElementById('avgLandSquareFeetValue').textContent = formattedAverage + ' ft²';
    }

    function updateAverageTotalUnits(data) {
        const totalUnits = data.reduce((acc, item) => acc + parseInt(item['TOTAL UNITS'], 10), 0);
        const formattedUnits = new Intl.NumberFormat('id-ID').format(totalUnits / 1000) + ' rb';
        document.getElementById('avgTotalUnitsValue').textContent = formattedUnits;
    }

    function formatCurrency(value) {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        });

        // Mengonversi ke format Rupiah
        const formattedValue = formatter.format(value);

        // Menggunakan singkatan untuk nilai besar
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(2)} M`;
        } else if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)} jt`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(2)} rb`;
        }

        return formattedValue;
    }

    function groupDataByBoroughAndDate(data) {
        const results = {};
        data.forEach(item => {
            const borough = item.BOROUGH;
            const date = new Date(item['SALE DATE']);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format: MM-YYYY

            if (!results[borough]) {
                results[borough] = {};
            }
            if (!results[borough][monthYear]) {
                results[borough][monthYear] = [];
            }
            results[borough][monthYear].push(parseFloat(item['SALE PRICE']));
        });

        const labels = [];
        const datasets = [];
        Object.keys(results).forEach(borough => {
            const monthYears = Object.keys(results[borough]).sort((a, b) => new Date(a.split('-')[1], a.split('-')[0]) - new Date(b.split('-')[1], b.split('-')[0]));
            const prices = monthYears.map(monthYear => {
                if (!labels.includes(monthYear)) {
                    labels.push(monthYear);
                }
                return average(results[borough][monthYear]);
            });
            datasets.push({
                label: borough,
                data: prices,
                fill: false,
                borderColor: getCategoryColor(borough), // Use color from categoryColors
                borderWidth: 2
            });
        });

        return {
            labels: labels,
            datasets: datasets
        };
    }

    function average(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    function groupDataByNeighborhood(data) {
        const unitsByNeighborhood = {};
        data.forEach(item => {
            const neighborhood = item.NEIGHBORHOOD;
            const totalUnits = parseInt(item['TOTAL UNITS']);

            if (!unitsByNeighborhood[neighborhood]) {
                unitsByNeighborhood[neighborhood] = 0;
            }
            unitsByNeighborhood[neighborhood] += totalUnits;
        });

        const sortedNeighborhoods = Object.keys(unitsByNeighborhood)
            .map(key => ({
                name: key,
                totalUnits: unitsByNeighborhood[key]
            }))
            .sort((a, b) => b.totalUnits - a.totalUnits)
            .slice(0, 10);

        return {
            labels: sortedNeighborhoods.map(n => n.name),
            totalUnits: sortedNeighborhoods.map(n => n.totalUnits),
            colors: sortedNeighborhoods.map(() => getRandomColor())
        };
    }

    function groupDataByBuildingAge(data) {
        const ageByBorough = {};
        data.forEach(item => {
            const borough = item.BOROUGH;
            const buildYear = parseInt(item['YEAR BUILT']);
            const currentYear = new Date().getFullYear();
            const buildingAge = currentYear - buildYear;

            if (!ageByBorough[borough]) {
                ageByBorough[borough] = [];
            }
            ageByBorough[borough].push(buildingAge);
        });

        const labels = Object.keys(ageByBorough);
        const ages = labels.map(borough => average(ageByBorough[borough]));
        const colors = labels.map(borough => getCategoryColor(borough));

        return {
            labels: labels,
            ages: ages,
            colors: colors
        };
    }

    function groupDataByCategoryBuilding(data) {
        const unitsByCategory = {};
        data.forEach(item => {
            const category = item['CATEGORY BUILDING'];
            const units = parseInt(item['RESIDENTIAL UNITS']);

            if (!unitsByCategory[category]) {
                unitsByCategory[category] = 0;
            }
            unitsByCategory[category] += units;
        });

        const sortedCategories = Object.keys(unitsByCategory)
            .map(key => ({
                name: key,
                units: unitsByCategory[key]
            }))
            .sort((a, b) => b.units - a.units)
            .slice(0, 10);

        return {
            labels: sortedCategories.map(n => n.name),
            units: sortedCategories.map(n => n.units),
            colors: sortedCategories.map(() => getRandomColor())
        };
    }

    function groupDataByCategoryBuildingCommercial(data) {
        const unitsByCategory = {};
        data.forEach(item => {
            const category = item['CATEGORY BUILDING'];
            const units = parseInt(item['COMMERCIAL UNITS']);

            if (!unitsByCategory[category]) {
                unitsByCategory[category] = 0;
            }
            unitsByCategory[category] += units;
        });

        const sortedCategories = Object.keys(unitsByCategory)
            .map(key => ({
                name: key,
                units: unitsByCategory[key]
            }))
            .sort((a, b) => b.units - a.units)
            .slice(0, 10);

        return {
            labels: sortedCategories.map(n => n.name),
            units: sortedCategories.map(n => n.units),
            colors: sortedCategories.map(() => getRandomColor())
        };
    }

    function groupDataByMonthAndYear(data) {
        const salesByMonthYear = {};
        data.forEach(item => {
            const date = new Date(item['SALE DATE']);
            if (!isNaN(date.getTime())) { // Memastikan tanggal valid
                const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format: MM-YYYY
                const totalUnits = parseInt(item['TOTAL UNITS'], 10);

                if (!salesByMonthYear[monthYear]) {
                    salesByMonthYear[monthYear] = 0;
                }
                salesByMonthYear[monthYear] += totalUnits;
            }
        });

        // Urutkan kunci berdasarkan tanggal untuk memastikan urutan kronologis
        const labels = Object.keys(salesByMonthYear).sort((a, b) => {
            const splitA = a.split('-');
            const splitB = b.split('-');
            const dateA = new Date(splitA[1], splitA[0] - 1);
            const dateB = new Date(splitB[1], splitB[0] - 1);
            return dateA - dateB;
        });
        const totalUnits = labels.map(monthYear => salesByMonthYear[monthYear]);

        return {
            labels: labels,
            totalUnits: totalUnits
        };
    }

    function updateChart(data) {
        propertyPriceChart.data = data;
        propertyPriceChart.update();
        console.log("Chart updated with data:", data);
    }

    function updateNeighborhoodChart(data) {
        neighborhoodSalesChart.data.labels = data.labels;
        neighborhoodSalesChart.data.datasets[0].data = data.totalUnits;
        neighborhoodSalesChart.data.datasets[0].backgroundColor = data.colors.map(() => getRandomColor()); // Changed to random color
        neighborhoodSalesChart.update();
    }

    function updateAverageBuildingAgeChart(data) {
        averageBuildingAgeChart.data.labels = data.labels;
        averageBuildingAgeChart.data.datasets[0].data = data.ages;
        averageBuildingAgeChart.data.datasets[0].backgroundColor = data.labels.map(label => getCategoryColor(label)); // Ensure consistent color
        averageBuildingAgeChart.update();
    }

    function updateTotalUnitSalesPerMonthChart(data) {
        totalUnitSalesPerMonthChart.data.labels = data.labels;
        totalUnitSalesPerMonthChart.data.datasets[0].data = data.totalUnits;
        totalUnitSalesPerMonthChart.data.datasets[0].borderColor = getRandomColor(); // Changed to random color
        totalUnitSalesPerMonthChart.update();
    }

    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 100%, 50%)`;
    }

    document.getElementById('boroughFilter').addEventListener('change', function() {
        const selectedBorough = this.value;
        const selectedCategory = document.getElementById('buildingCategoryFilter').value;
        const selectedMonthYear = document.getElementById('monthYearFilter').value;
        fetchData(selectedBorough, selectedCategory, selectedMonthYear);
        addBoroughMarkers(selectedBorough);
    });

    document.getElementById('buildingCategoryFilter').addEventListener('change', function() {
        const selectedCategory = this.value;
        const selectedBorough = document.getElementById('boroughFilter').value;
        const selectedMonthYear = document.getElementById('monthYearFilter').value;
        fetchData(selectedBorough, selectedCategory, selectedMonthYear);
    });

    document.getElementById('monthYearFilter').addEventListener('change', function() {
        const selectedMonthYear = this.value;
        const selectedBorough = document.getElementById('boroughFilter').value;
        const selectedCategory = document.getElementById('buildingCategoryFilter').value;
        fetchData(selectedBorough, selectedCategory, selectedMonthYear);
    });

    fetchData('BOROUGH', 'CATEGORY BUILDING', 'SALE DATE');
});
