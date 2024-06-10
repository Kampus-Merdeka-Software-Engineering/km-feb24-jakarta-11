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

    // Warna tetap untuk setiap borough
    const boroughColors = {
        'Manhattan': '#1F77B4', // Blue
        'Brooklyn': '#FF7F0E', // Orange
        'Queens': '#2CA02C', // Green
        'Bronx': '#D62728', // Red
        'Staten Island': '#9467BD' // Purple
    };

    // Warna tetap untuk setiap kategori bangunan
    const categoryColors = {
        'ASYLUMS AND HOMES': '#8B0000', // Dark Red
        'COMMERCIAL CONDOS': '#008B00', // Dark Green
        'COMMERCIAL GARAGES': '#00008B', // Dark Blue
        'COMMERCIAL VACANT LAND': '#8B008B', // Dark Magenta
        'CONDO': '#8B4500', // Dark Orange
        'CONDO COOPS': '#8B8B00', // Dark Yellow
        'CONDO CULTURAL/MEDICAL/EDUCATIONAL/ETC': '#4682B4', // Steel Blue
        'CONDO HOTELS': '#D2691E', // Chocolate
        'CONDO NON': '#556B2F', // Dark Olive Green
        'CONDO OFFICE BUILDINGS': '#FF4500', // Orange Red
        'CONDO PARKING': '#2E8B57', // Sea Green
        'CONDO STORE BUILDINGS': '#DAA520', // Golden Rod
        'CONDO TERRACES/GARDENS/CABANAS': '#B8860B', // Dark Golden Rod
        'CONDO WAREHOUSES/FACTORY/INDUS': '#CD5C5C', // Indian Red
        'CONDOS': '#4B0082', // Indigo
        'COOPS': '#9932CC', // Dark Orchid
        'EDUCATIONAL FACILITIES': '#8A2BE2', // Blue Violet
        'FACTORIES': '#A52A2A', // Brown
        'HOSPITAL AND HEALTH FACILITIES': '#5F9EA0', // Cadet Blue
        'INDOOR PUBLIC AND CULTURAL FACILITIES': '#D2691E', // Chocolate
        'LOFT BUILDINGS': '#FF7F50', // Coral
        'LUXURY HOTELS': '#6495ED', // Cornflower Blue
        'OFFICE BUILDINGS': '#DC143C', // Crimson
        'ONE FAMILY DWELLINGS': '#00FFFF', // Cyan
        'OTHER HOTELS': '#00008B', // Dark Blue
        'OUTDOOR RECREATIONAL FACILITIES': '#008B8B', // Dark Cyan
        'RELIGIOUS FACILITIES': '#B8860B', // Dark Golden Rod
        'RENTALS': '#A9A9A9', // Dark Gray
        'SELECTED GOVERNMENTAL FACILITIES': '#006400', // Dark Green
        'SPECIAL CONDO BILLING LOTS': '#BDB76B', // Dark Khaki
        'STORE BUILDINGS': '#8B008B', // Dark Magenta
        'TAX CLASS 1': '#556B2F', // Dark Olive Green
        'TAX CLASS 1 CONDOS': '#FF8C00', // Dark Orange
        'TAX CLASS 1 VACANT LAND': '#9932CC', // Dark Orchid
        'TAX CLASS 3': '#8B0000', // Dark Red
        'TAX CLASS 4': '#E9967A', // Dark Salmon
        'THEATRES': '#8FBC8F', // Dark Sea Green
        'THREE FAMILY DWELLINGS': '#483D8B', // Dark Slate Blue
        'TRANSPORTATION FACILITIES': '#2F4F4F', // Dark Slate Gray
        'TWO FAMILY DWELLINGS': '#00CED1', // Dark Turquoise
        'WAREHOUSES': '#9400D3' // Dark Violet
    };

    // Warna tetap untuk setiap neighborhood
    const neighborhoodColors = {
        'ALPHABET CITY': '#FF5733',
        'CHELSEA': '#33FF57',
        'CIVIC CENTER': '#3357FF',
        'EAST VILLAGE': '#FF33A1',
        'GRAMERCY': '#FF8C33',
        'GREENWICH VILLAGE-CENTRAL': '#8B0000',
        'GREENWICH VILLAGE-WEST': '#008B00',
        'HARLEM-CENTRAL': '#00008B',
        'HARLEM-EAST': '#8B008B',
        'INWOOD': '#8B4500',
        'KIPS BAY': '#8B8B00',
        'LOWER EAST SIDE': '#4682B4',
        'MANHATTAN VALLEY': '#D2691E',
        'MIDTOWN CBD': '#556B2F',
        'MIDTOWN EAST': '#FF4500',
        'MIDTOWN WEST': '#2E8B57',
        'MURRAY HILL': '#DAA520',
        'SOHO': '#B8860B',
        'SOUTHBRIDGE': '#CD5C5C',
        'TRIBECA': '#4B0082',
        'UPPER EAST SIDE (59-79)': '#9932CC',
        'UPPER EAST SIDE (79-96)': '#8A2BE2',
        'UPPER WEST SIDE (59-79)': '#A52A2A',
        'UPPER WEST SIDE (79-96)': '#5F9EA0',
        'UPPER WEST SIDE (96-116)': '#D2691E',
        'WASHINGTON HEIGHTS UPPER': '#FF7F50',
        'BATHGATE': '#6495ED',
        'BAYCHESTER': '#DC143C',
        'BRONXDALE': '#00FFFF',
        'EAST TREMONT': '#00008B',
        'HIGHBRIDGE/MORRIS HEIGHTS': '#008B8B',
        'KINGSBRIDGE/JEROME PARK': '#B8860B',
        'MOUNT HOPE/MOUNT EDEN': '#A9A9A9',
        'PARKCHESTER': '#006400',
        'PELHAM GARDENS': '#BDB76B',
        'RIVERDALE': '#8B008B',
        'SCHUYLERVILLE/PELHAM BAY': '#556B2F',
        'SOUNDVIEW': '#FF8C00',
        'THROGS NECK': '#9932CC',
        'WAKEFIELD': '#8B0000',
        'WILLIAMSBRIDGE': '#E9967A',
        'WOODLAWN': '#8FBC8F',
        'BATH BEACH': '#483D8B',
        'BAY RIDGE': '#2F4F4F',
        'BEDFORD STUYVESANT': '#00CED1',
        'BENSONHURST': '#9400D3',
        'BERGEN BEACH': '#FF5733',
        'BOERUM HILL': '#33FF57',
        'BOROUGH PARK': '#3357FF',
        'BRIGHTON BEACH': '#FF33A1',
        'BROOKLYN HEIGHTS': '#FF8C33',
        'BROWNSVILLE': '#8B0000',
        'BUSH TERMINAL': '#008B00',
        'BUSHWICK': '#00008B',
        'CANARSIE': '#8B008B',
        'CLINTON HILL': '#8B4500',
        'COBBLE HILL-WEST': '#8B8B00',
        'CONEY ISLAND': '#4682B4',
        'CROWN HEIGHTS': '#D2691E',
        'CYPRESS HILLS': '#556B2F',
        'DOWNTOWN-FULTON FERRY': '#FF4500',
        'DOWNTOWN-FULTON MALL': '#2E8B57',
        'DOWNTOWN-METROTECH': '#DAA520',
        'EAST NEW YORK': '#B8860B',
        'FLATBUSH-EAST': '#CD5C5C',
        'FLATBUSH-NORTH': '#4B0082',
        'FLATLANDS': '#9932CC',
        'FORT GREENE': '#8A2BE2',
        'GRAVESEND': '#A52A2A',
        'GREENPOINT': '#5F9EA0',
        'KENSINGTON': '#D2691E',
        'MADISON': '#FF7F50',
        'MARINE PARK': '#6495ED',
        'MIDWOOD': '#DC143C',
        'OCEAN PARKWAY-NORTH': '#00FFFF',
        'OCEAN PARKWAY-SOUTH': '#00008B',
        'OLD MILL BASIN': '#008B8B',
        'PARK SLOPE': '#B8860B',
        'PROSPECT HEIGHTS': '#A9A9A9',
        'SHEEPSHEAD BAY': '#006400',
        'WILLIAMSBURG-EAST': '#BDB76B',
        'WILLIAMSBURG-NORTH': '#8B008B',
        'ARVERNE': '#556B2F',
        'ASTORIA': '#FF8C00',
        'BAYSIDE': '#9932CC',
        'BEECHHURST': '#8B0000',
        'BELLEROSE': '#E9967A',
        'BRIARWOOD': '#8FBC8F',
        'CAMBRIA HEIGHTS': '#483D8B',
        'COLLEGE POINT': '#2F4F4F',
        'CORONA': '#00CED1',
        'DOUGLASTON': '#9400D3',
        'EAST ELMHURST': '#FF5733',
        'ELMHURST': '#33FF57',
        'FLORAL PARK': '#3357FF',
        'FLUSHING-NORTH': '#FF33A1',
        'FLUSHING-SOUTH': '#FF8C33',
        'FOREST HILLS': '#8B0000',
        'FRESH MEADOWS': '#008B00',
        'GLEN OAKS': '#5F9EA0',
        'GLENDALE': '#8B008B',
        'HILLCREST': '#8B4500',
        'HOLLIS': '#8B8B00',
        'HOLLIS HILLS': '#4682B4',
        'HOLLISWOOD': '#D2691E',
        'HOWARD BEACH': '#556B2F',
        'JACKSON HEIGHTS': '#FF4500',
        'JAMAICA': '#2E8B57',
        'JAMAICA ESTATES': '#DAA520',
        'JAMAICA HILLS': '#B8860B',
        'KEW GARDENS': '#CD5C5C',
        'LAURELTON': '#4B0082',
        'LITTLE NECK': '#9932CC',
        'LONG ISLAND CITY': '#8A2BE2',
        'MASPETH': '#A52A2A',
        'OAKLAND GARDENS': '#5F9EA0',
        'OZONE PARK': '#D2691E',
        'QUEENS VILLAGE': '#FF7F50',
        'REGO PARK': '#6495ED',
        'RICHMOND HILL': '#DC143C',
        'RIDGEWOOD': '#00FFFF',
        'ROCKAWAY PARK': '#00008B',
        'SO. JAMAICA-BAISLEY PARK': '#008B8B',
        'SOUTH JAMAICA': '#B8860B',
        'ST. ALBANS': '#A9A9A9',
        'SUNNYSIDE': '#006400',
        'WHITESTONE': '#BDB76B',
        'WOODHAVEN': '#8B008B',
        'WOODSIDE': '#556B2F',
        'BLOOMFIELD': '#FF8C00',
        'BULLS HEAD': '#9932CC',
        'CLOVE LAKES': '#8B0000',
        'DONGAN HILLS': '#E9967A',
        'DONGAN HILLS-COLONY': '#8FBC8F',
        'ELTINGVILLE': '#483D8B',
        'GRANT CITY': '#2F4F4F',
        'GREAT KILLS': '#00CED1',
        'GRYMES HILL': '#9400D3',
        'HUGUENOT': '#FF5733',
        'NEW BRIGHTON': '#33FF57',
        'NEW DORP': '#3357FF',
        'NEW DORP-BEACH': '#FF33A1',
        'PLEASANT PLAINS': '#FF8C33',
        'PORT RICHMOND': '#8B0000',
        'PRINCES BAY': '#008B00',
        'ROSEBANK': '#00008B',
        'TRAVIS': '#8B008B',
        'WEST NEW BRIGHTON': '#8B4500',
        'WESTERLEIGH': '#8B8B00',
        'WILLOWBROOK': '#4682B4',
        'WOODROW': '#D2691E',
        'CLINTON': '#556B2F',
        'FASHION': '#FF4500',
        'FLATIRON': '#2E8B57',
        'COUNTRY CLUB': '#DAA520',
        'FORDHAM': '#B8860B',
        'MELROSE/CONCOURSE': '#CD5C5C',
        'MORRISANIA/LONGWOOD': '#4B0082',
        'FLATBUSH-CENTRAL': '#9932CC',
        'FLATBUSH-LEFFERTS GARDEN': '#8A2BE2',
        'GOWANUS': '#A52A2A',
        'OCEAN HILL': '#5F9EA0',
        'SEAGATE': '#D2691E',
        'SUNSET PARK': '#FF7F50',
        'WILLIAMSBURG-SOUTH': '#6495ED',
        'FAR ROCKAWAY': '#DC143C',
        'MIDDLE VILLAGE': '#00FFFF',
        'ROSEDALE': '#00008B',
        'SOUTH OZONE PARK': '#008B8B',
        'SPRINGFIELD GARDENS': '#B8860B',
        'ARDEN HEIGHTS': '#A9A9A9',
        'ARROCHAR': '#006400',
        'MIDLAND BEACH': '#BDB76B',
        'NEW DORP-HEIGHTS': '#8B008B',
        'NEW SPRINGVILLE': '#556B2F',
        'RICHMONDTOWN': '#FF8C00',
        'SOUTH BEACH': '#9932CC',
        'STAPLETON': '#8B0000',
        'TOTTENVILLE': '#E9967A',
        'CASTLE HILL/UNIONPORT': '#8FBC8F',
        'GREAT KILLS-BAY TERRACE': '#483D8B',
        'FINANCIAL': '#2F4F4F',
        'WASHINGTON HEIGHTS LOWER': '#00CED1',
        'BEDFORD PARK/NORWOOD': '#9400D3',
        'MORRIS PARK/VAN NEST': '#FF5733',
        'PELHAM PARKWAY NORTH': '#33FF57',
        'PELHAM PARKWAY SOUTH': '#3357FF',
        'CARROLL GARDENS': '#FF33A1',
        'COBBLE HILL': '#FF8C33',
        'PARK SLOPE SOUTH': '#8B0000',
        'WILLIAMSBURG-CENTRAL': '#008B00',
        'WINDSOR TERRACE': '#00008B',
        'WYCKOFF HEIGHTS': '#8B008B',
        'HAMMELS': '#8B4500',
        'DONGAN HILLS-OLD TOWN': '#8B8B00',
        'EMERSON HILL': '#4682B4',
        'LIVINGSTON': '#D2691E',
        'MANOR HEIGHTS': '#556B2F',
        'MARINERS HARBOR': '#FF4500',
        'SILVER LAKE': '#2E8B57',
        'LITTLE ITALY': '#DAA520',
        'MORNINGSIDE HEIGHTS': '#B8860B',
        'ROOSEVELT ISLAND': '#CD5C5C',
        'CITY ISLAND': '#4B0082',
        'CROTONA PARK': '#9932CC',
        'FIELDSTON': '#8A2BE2',
        'PELHAM BAY': '#A52A2A',
        'DYKER HEIGHTS': '#5F9EA0',
        'BELLE HARBOR': '#D2691E',
        'ANNADALE': '#FF7F50',
        'OAKWOOD': '#6495ED',
        'ROSSVILLE': '#DC143C',
        'CHINATOWN': '#00FFFF',
        'KINGSBRIDGE HTS/UNIV HTS': '#00008B',
        'GERRITSENTS': '#00008B',
        'GERRITSEN BEACH': '#008B8B',
        'MANHATTAN BEACH': '#B8860B',
        'NAVY YARD': '#A9A9A9',
        'JAMAICA BAY': '#006400',
        'ARROCHAR-SHORE ACRES': '#BDB76B',
        'OAKWOOD-BEACH': '#8B008B',
        'PORT IVORY': '#556B2F',
        'STAPLETON-CLIFTON': '#FF8C00',
        'MOTT HAVEN/PORT MORRIS': '#9932CC',
        'RED HOOK': '#8B0000',
        'TOMPKINSVILLE': '#E9967A',
        'JAVITS CENTER': '#8FBC8F',
        'UPPER EAST SIDE (96-110)': '#483D8B',
        'BELMONT': '#2F4F4F',
        'MILL BASIN': '#00CED1',
        'CONCORD': '#9400D3',
        'HARLEM-UPPER': '#FF5733',
        'WESTCHESTER': '#33FF57',
        'NEPONSIT': '#3357FF',
        'CASTLETON CORNERS': '#FF33A1',
        'ROSSVILLE-CHARLESTON': '#FF8C33',
        'CONCORD-FOX HILLS': '#8B0000',
        'FRESH KILLS': '#008B00',
        'GRASMERE': '#00008B',
        'NEW BRIGHTON-ST. GEORGE': '#8B008B',
        'BROAD CHANNEL': '#8B4500',
        'HARLEM-WEST': '#8B8B00',
        'FLUSHING MEADOW PARK': '#4682B4',
        'HUNTS POINT': '#D2691E',
        'RICHMONDTOWN-LIGHTHS HILL': '#556B2F',
        'TODT HILL': '#FF4500',
        'SPRING CREEK': '#2E8B57',
        'CITY ISLAND-PELHAM STRIP': '#DAA520',
        'ROSSVILLE-RICHMOND VALLEY': '#B8860B',
        'BRONX PARK': '#CD5C5C',
        'AIRPORT LA GUARDIA': '#4B0082',
        'CO-OP CITY': '#9932CC',
        'ROSSVILLE-PORT MOBIL': '#8A2BE2',
        'EAST RIVER': '#A52A2A',
        'VAN CORTLANDT PARK': '#5F9EA0'
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

    function initChart(data) {
        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets.map(dataset => ({
                    ...dataset,
                    borderColor: boroughColors[dataset.label] // Use color from boroughColors
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
    }

    function initNeighborhoodChart(data) {
        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.totalUnits,
                    backgroundColor: data.labels.map(label => neighborhoodColors[label]), // Use color from neighborhoodColors
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
        const colors = data.labels.map(label => boroughColors[label]); // Use color from boroughColors
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

    function initcategoryBuildingResidentialUnitsChart(data) {
        const config = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Residential Units',
                    data: data.units,
                    backgroundColor: data.labels.map(label => categoryColors[label]), // Use color from categoryColors object
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
                    backgroundColor: data.labels.map(label => categoryColors[label]), // Use color from categoryColors object
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
                    borderColor: '#3357FF', // Changed to consistent blue color
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
        categoryBuildingResidentialUnitsChart.data.datasets[0].backgroundColor = data.labels.map(label => categoryColors[label]); // Use color from categoryColors object
        categoryBuildingResidentialUnitsChart.update();
    }

    function updateCategoryBuildingCommercialUnitsChart(data) {
        categoryBuildingCommercialUnitsChart.data.labels = data.labels;
        categoryBuildingCommercialUnitsChart.data.datasets[0].data = data.units;
        categoryBuildingCommercialUnitsChart.data.datasets[0].backgroundColor = data.labels.map(label => categoryColors[label]); // Use color from categoryColors object
        categoryBuildingCommercialUnitsChart.update();
    }

    function fetchData(borough = 'BOROUGH', category = 'CATEGORY BUILDING', monthYears = []) {
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
                if (monthYears.length > 0) {
                    filteredData = filteredData.filter(item => {
                        const itemDate = new Date(item['SALE DATE']);
                        const itemMonthYear = `${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;
                        return monthYears.includes(itemMonthYear);
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
        const formattedUnits = new Intl.NumberFormat('id-ID').format(totalUnits / 1000) + '';
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
            return `${(value / 1000000000).toFixed(2)} B`;
        } else if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)} M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(2)} K`;
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
                borderColor: boroughColors[borough], // Use color from boroughColors
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
            colors: sortedNeighborhoods.map(n => neighborhoodColors[n.name]) // Use color from neighborhoodColors
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
        const colors = labels.map(borough => boroughColors[borough]); // Use color from boroughColors

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
            colors: sortedCategories.map(n => categoryColors[n.name]) // Use color from categoryColors
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
            colors: sortedCategories.map(n => categoryColors[n.name]) // Use color from categoryColors
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
    }

    function updateNeighborhoodChart(data) {
        neighborhoodSalesChart.data.labels = data.labels;
        neighborhoodSalesChart.data.datasets[0].data = data.totalUnits;
        neighborhoodSalesChart.data.datasets[0].backgroundColor = data.labels.map(label => neighborhoodColors[label]); // Use color from neighborhoodColors
        neighborhoodSalesChart.update();
    }

    function updateAverageBuildingAgeChart(data) {
        averageBuildingAgeChart.data.labels = data.labels;
        averageBuildingAgeChart.data.datasets[0].data = data.ages;
        averageBuildingAgeChart.data.datasets[0].backgroundColor = data.labels.map(label => boroughColors[label]); // Ensure consistent color
        averageBuildingAgeChart.update();
    }

    function updateTotalUnitSalesPerMonthChart(data) {
        totalUnitSalesPerMonthChart.data.labels = data.labels;
        totalUnitSalesPerMonthChart.data.datasets[0].data = data.totalUnits;
        totalUnitSalesPerMonthChart.data.datasets[0].borderColor = '#3357FF'; // Changed to consistent blue color
        totalUnitSalesPerMonthChart.update();
    }

    $(document).ready(function() {
        $('#monthYearFilter').select2({
            placeholder: "- SELECT MONTH -",
            allowClear: true
        });

        $('#boroughFilter').on('change', function() {
            const selectedBorough = this.value;
            const selectedCategory = $('#buildingCategoryFilter').val();
            const selectedMonthYears = $('#monthYearFilter').val();
            fetchData(selectedBorough, selectedCategory, selectedMonthYears);
            addBoroughMarkers(selectedBorough);
        });

        $('#buildingCategoryFilter').on('change', function() {
            const selectedCategory = this.value;
            const selectedBorough = $('#boroughFilter').val();
            const selectedMonthYears = $('#monthYearFilter').val();
            fetchData(selectedBorough, selectedCategory, selectedMonthYears);
        });

        $('#monthYearFilter').on('change', function() {
            const selectedMonthYears = $(this).val();
            const selectedBorough = $('#boroughFilter').val();
            const selectedCategory = $('#buildingCategoryFilter').val();
            fetchData(selectedBorough, selectedCategory, selectedMonthYears);
        });

        fetchData('BOROUGH', 'CATEGORY BUILDING', []);
    });

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
