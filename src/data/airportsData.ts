import type { MapAirport } from '../types/flight';

/*
 * BASE DE DONNÉES STATIQUE DES AÉROPORTS MAJEURS (VIP)
 */
export const STATIC_AIRPORTS: MapAirport[] = [
  { skyId: "CDG", entityId: "95565050", name: "Paris Charles de Gaulle", city: "Paris", country: "France", lat: 49.0097, lng: 2.5479, tier: 1 },
  { skyId: "ORY", entityId: "95565051", name: "Paris Orly", city: "Paris", country: "France", lat: 48.7262, lng: 2.3652, tier: 2 },
  { skyId: "NCE", entityId: "95565052", name: "Nice Côte d'Azur", city: "Nice", country: "France", lat: 43.6584, lng: 7.2158, tier: 2 },
  { skyId: "MRS", entityId: "95565053", name: "Marseille Provence", city: "Marseille", country: "France", lat: 43.4367, lng: 5.2150, tier: 2 },
  { skyId: "LYS", entityId: "95565054", name: "Lyon-Saint Exupéry", city: "Lyon", country: "France", lat: 45.7256, lng: 5.0811, tier: 2 },
  { skyId: "TLS", entityId: "95565100", name: "Toulouse Blagnac", city: "Toulouse", country: "France", lat: 43.6291, lng: 1.3638, tier: 3 },
  { skyId: "BOD", entityId: "95565101", name: "Bordeaux Mérignac", city: "Bordeaux", country: "France", lat: 44.8283, lng: -0.7156, tier: 3 },
  { skyId: "NTE", entityId: "95565102", name: "Nantes Atlantique", city: "Nantes", country: "France", lat: 47.1532, lng: -1.6107, tier: 3 },
  { skyId: "LIL", entityId: "95565103", name: "Lille Lesquin", city: "Lille", country: "France", lat: 50.5619, lng: 3.0894, tier: 3 },
  { skyId: "SXB", entityId: "95565104", name: "Strasbourg Entzheim", city: "Strasbourg", country: "France", lat: 48.5383, lng: 7.6282, tier: 3 },
  { skyId: "MPL", entityId: "95565105", name: "Montpellier Méditerranée", city: "Montpellier", country: "France", lat: 43.5762, lng: 3.9614, tier: 3 },
  { skyId: "AJA", entityId: "95565106", name: "Ajaccio Napoléon Bonaparte", city: "Ajaccio", country: "France", lat: 41.9237, lng: 8.8029, tier: 3 },
  { skyId: "BIA", entityId: "95565107", name: "Bastia Poretta", city: "Bastia", country: "France", lat: 42.5527, lng: 9.4837, tier: 3 },
  { skyId: "BIQ", entityId: "95565108", name: "Biarritz Pays Basque", city: "Biarritz", country: "France", lat: 43.4681, lng: -1.5233, tier: 3 },
  { skyId: "RUN", entityId: "95565120", name: "La Réunion Roland Garros", city: "Saint-Denis", country: "La Réunion", lat: -20.8874, lng: 55.5153, tier: 2 },
  { skyId: "PTP", entityId: "95565122", name: "Guadeloupe Pôle Caraïbes", city: "Pointe-à-Pitre", country: "Guadeloupe", lat: 16.2653, lng: -61.5318, tier: 2 },
  { skyId: "FDF", entityId: "95565123", name: "Martinique Aimé Césaire", city: "Fort-de-France", country: "Martinique", lat: 14.5910, lng: -61.0032, tier: 2 },
  { skyId: "PPT", entityId: "95565121", name: "Tahiti Faa'a", city: "Papeete", country: "Polynésie Française", lat: -17.5539, lng: -149.6072, tier: 3 },
  { skyId: "NOU", entityId: "95565124", name: "Nouméa La Tontouta", city: "Nouméa", country: "Nouvelle-Calédonie", lat: -22.0146, lng: 166.2130, tier: 3 },
  { skyId: "LHR", entityId: "95565055", name: "Londres Heathrow", city: "Londres", country: "Royaume-Uni", lat: 51.4700, lng: -0.4543, tier: 1 },
  { skyId: "LGW", entityId: "95565056", name: "Londres Gatwick", city: "Londres", country: "Royaume-Uni", lat: 51.1537, lng: -0.1821, tier: 2 },
  { skyId: "MAN", entityId: "95565109", name: "Manchester", city: "Manchester", country: "Royaume-Uni", lat: 53.3537, lng: -2.2750, tier: 3 },
  { skyId: "EDI", entityId: "95565057", name: "Edimbourg", city: "Edimbourg", country: "Royaume-Uni", lat: 55.9500, lng: -3.3725, tier: 3 },
  { skyId: "DUB", entityId: "95565110", name: "Dublin", city: "Dublin", country: "Irlande", lat: 53.4213, lng: -6.2701, tier: 2 },
  { skyId: "AMS", entityId: "95565073", name: "Amsterdam Schiphol", city: "Amsterdam", country: "Pays-Bas", lat: 52.3086, lng: 4.7638, tier: 1 },
  { skyId: "BRU", entityId: "95565074", name: "Bruxelles", city: "Bruxelles", country: "Belgique", lat: 50.9014, lng: 4.4844, tier: 2 },
  { skyId: "FRA", entityId: "95565070", name: "Francfort", city: "Francfort", country: "Allemagne", lat: 50.0379, lng: 8.5622, tier: 1 },
  { skyId: "MUC", entityId: "95565071", name: "Munich", city: "Munich", country: "Allemagne", lat: 48.3537, lng: 11.7860, tier: 2 },
  { skyId: "BER", entityId: "95565072", name: "Berlin", city: "Berlin", country: "Allemagne", lat: 52.3667, lng: 13.5033, tier: 2 },
  { skyId: "GVA", entityId: "95565075", name: "Genève", city: "Genève", country: "Suisse", lat: 46.2381, lng: 6.1089, tier: 2 },
  { skyId: "ZRH", entityId: "95565076", name: "Zurich", city: "Zurich", country: "Suisse", lat: 47.4647, lng: 8.5492, tier: 2 },
  { skyId: "VIE", entityId: "95565077", name: "Vienne", city: "Vienne", country: "Autriche", lat: 48.1103, lng: 16.5697, tier: 2 },
  { skyId: "CPH", entityId: "95565078", name: "Copenhague", city: "Copenhague", country: "Danemark", lat: 55.6180, lng: 12.6560, tier: 2 },
  { skyId: "OSL", entityId: "95565079", name: "Oslo", city: "Oslo", country: "Norvège", lat: 60.1975, lng: 11.1004, tier: 2 },
  { skyId: "ARN", entityId: "95565080", name: "Stockholm Arlanda", city: "Stockholm", country: "Suède", lat: 59.6519, lng: 17.9186, tier: 2 },
  { skyId: "HEL", entityId: "95565125", name: "Helsinki", city: "Helsinki", country: "Finlande", lat: 60.3172, lng: 24.9633, tier: 3 },
  { skyId: "KEF", entityId: "95565126", name: "Reykjavik Keflavik", city: "Reykjavik", country: "Islande", lat: 63.9850, lng: -22.6056, tier: 3 },
  { skyId: "PRG", entityId: "95565081", name: "Prague", city: "Prague", country: "Rép. Tchèque", lat: 50.1008, lng: 14.2600, tier: 2 },
  { skyId: "WAW", entityId: "95565082", name: "Varsovie", city: "Varsovie", country: "Pologne", lat: 52.1657, lng: 20.9671, tier: 2 },
  { skyId: "BUD", entityId: "95565127", name: "Budapest", city: "Budapest", country: "Hongrie", lat: 47.4369, lng: 19.2375, tier: 3 },
  { skyId: "OTP", entityId: "95565128", name: "Bucarest", city: "Bucarest", country: "Roumanie", lat: 44.5711, lng: 26.0850, tier: 3 },
  { skyId: "MAD", entityId: "95565057", name: "Madrid Barajas", city: "Madrid", country: "Espagne", lat: 40.4983, lng: -3.5676, tier: 1 },
  { skyId: "BCN", entityId: "95565056", name: "Barcelone El Prat", city: "Barcelone", country: "Espagne", lat: 41.2974, lng: 2.0833, tier: 2 },
  { skyId: "PMI", entityId: "95565058", name: "Palma de Majorque", city: "Palma", country: "Espagne", lat: 39.5517, lng: 2.7388, tier: 2 },
  { skyId: "AGP", entityId: "95565059", name: "Malaga", city: "Malaga", country: "Espagne", lat: 36.6749, lng: -4.4991, tier: 2 },
  { skyId: "IBZ", entityId: "95565129", name: "Ibiza", city: "Ibiza", country: "Espagne", lat: 38.8729, lng: 1.3731, tier: 3 },
  { skyId: "TFS", entityId: "95565130", name: "Tenerife Sud", city: "Tenerife", country: "Espagne", lat: 28.0445, lng: -16.5725, tier: 3 },
  { skyId: "LPA", entityId: "95565131", name: "Gran Canaria", city: "Las Palmas", country: "Espagne", lat: 27.9319, lng: -15.3866, tier: 3 },
  { skyId: "ACE", entityId: "95565171", name: "Lanzarote", city: "Lanzarote", country: "Espagne", lat: 28.9455, lng: -13.6052, tier: 3 },
  { skyId: "FUE", entityId: "95565172", name: "Fuerteventura", city: "Fuerteventura", country: "Espagne", lat: 28.4527, lng: -13.8638, tier: 3 },
  { skyId: "LIS", entityId: "95565058", name: "Lisbonne Humberto Delgado", city: "Lisbonne", country: "Portugal", lat: 38.7742, lng: -9.1342, tier: 2 },
  { skyId: "OPO", entityId: "95565059", name: "Porto", city: "Porto", country: "Portugal", lat: 41.2481, lng: -8.6814, tier: 3 },
  { skyId: "FAO", entityId: "95565111", name: "Faro", city: "Faro", country: "Portugal", lat: 37.0144, lng: -7.9659, tier: 3 },
  { skyId: "FNC", entityId: "95565132", name: "Madère", city: "Funchal", country: "Portugal", lat: 32.6979, lng: -16.7744, tier: 3 },
  { skyId: "PDL", entityId: "95565168", name: "Ponta Delgada (Açores)", city: "Ponta Delgada", country: "Portugal", lat: 37.7412, lng: -25.6978, tier: 3 },
  { skyId: "HOR", entityId: "95565169", name: "Horta (Açores)", city: "Horta", country: "Portugal", lat: 38.5200, lng: -28.7158, tier: 3 },
  { skyId: "TER", entityId: "95565170", name: "Lajes (Açores)", city: "Terceira", country: "Portugal", lat: 38.7619, lng: -27.0908, tier: 3 },
  { skyId: "FCO", entityId: "95565060", name: "Rome Fiumicino", city: "Rome", country: "Italie", lat: 41.8003, lng: 12.2389, tier: 1 },
  { skyId: "MXP", entityId: "95565072", name: "Milan Malpensa", city: "Milan", country: "Italie", lat: 45.6300, lng: 8.7231, tier: 2 },
  { skyId: "VCE", entityId: "95565073", name: "Venise Marco Polo", city: "Venise", country: "Italie", lat: 45.5053, lng: 12.3519, tier: 2 },
  { skyId: "NAP", entityId: "95565112", name: "Naples", city: "Naples", country: "Italie", lat: 40.8860, lng: 14.2908, tier: 3 },
  { skyId: "PMO", entityId: "95565133", name: "Palerme", city: "Palerme", country: "Italie", lat: 38.1760, lng: 13.0910, tier: 3 },
  { skyId: "CTA", entityId: "95565134", name: "Catane", city: "Catane", country: "Italie", lat: 37.4668, lng: 15.0664, tier: 3 },
  { skyId: "ATH", entityId: "95565074", name: "Athènes", city: "Athènes", country: "Grèce", lat: 37.9363, lng: 23.9445, tier: 2 },
  { skyId: "JTR", entityId: "95565135", name: "Santorin", city: "Santorin", country: "Grèce", lat: 36.3992, lng: 25.4793, tier: 3 },
  { skyId: "HER", entityId: "95565136", name: "Héraklion", city: "Crète", country: "Grèce", lat: 35.3397, lng: 25.1803, tier: 3 },
  { skyId: "JMK", entityId: "95565173", name: "Mykonos", city: "Mykonos", country: "Grèce", lat: 37.4351, lng: 25.3481, tier: 3 },
  { skyId: "MLA", entityId: "95565137", name: "Malte", city: "La Valette", country: "Malte", lat: 35.8575, lng: 14.4775, tier: 3 },
  { skyId: "IST", entityId: "95565075", name: "Istanbul", city: "Istanbul", country: "Turquie", lat: 41.2752, lng: 28.7519, tier: 1 },
  { skyId: "AYT", entityId: "95565138", name: "Antalya", city: "Antalya", country: "Turquie", lat: 36.8987, lng: 30.8005, tier: 3 },
  { skyId: "JFK", entityId: "95565062", name: "New York JFK", city: "New York", country: "États-Unis", lat: 40.6413, lng: -73.7781, tier: 1 },
  { skyId: "LAX", entityId: "95565076", name: "Los Angeles", city: "Los Angeles", country: "États-Unis", lat: 33.9416, lng: -118.4085, tier: 1 },
  { skyId: "MIA", entityId: "95565077", name: "Miami", city: "Miami", country: "États-Unis", lat: 25.7959, lng: -80.2870, tier: 2 },
  { skyId: "SFO", entityId: "95565078", name: "San Francisco", city: "San Francisco", country: "États-Unis", lat: 37.6213, lng: -122.3790, tier: 2 },
  { skyId: "LAS", entityId: "95565079", name: "Las Vegas", city: "Las Vegas", country: "États-Unis", lat: 36.0840, lng: -115.1537, tier: 2 },
  { skyId: "ORD", entityId: "95565080", name: "Chicago O'Hare", city: "Chicago", country: "États-Unis", lat: 41.9742, lng: -87.9073, tier: 2 },
  { skyId: "DFW", entityId: "95565113", name: "Dallas", city: "Dallas", country: "États-Unis", lat: 32.8998, lng: -97.0403, tier: 2 },
  { skyId: "ATL", entityId: "95565114", name: "Atlanta", city: "Atlanta", country: "États-Unis", lat: 33.6407, lng: -84.4277, tier: 2 },
  { skyId: "MCO", entityId: "95565139", name: "Orlando", city: "Orlando", country: "États-Unis", lat: 28.4294, lng: -81.3089, tier: 3 },
  { skyId: "HNL", entityId: "95565140", name: "Honolulu", city: "Honolulu", country: "États-Unis (Hawaï)", lat: 21.3187, lng: -157.9225, tier: 3 },
  { skyId: "YYZ", entityId: "95565079", name: "Toronto Pearson", city: "Toronto", country: "Canada", lat: 43.6777, lng: -79.6248, tier: 2 },
  { skyId: "YUL", entityId: "95565080", name: "Montréal Trudeau", city: "Montréal", country: "Canada", lat: 45.4706, lng: -73.7408, tier: 2 },
  { skyId: "YVR", entityId: "95565115", name: "Vancouver", city: "Vancouver", country: "Canada", lat: 49.1967, lng: -123.1815, tier: 3 },
  { skyId: "MEX", entityId: "95565085", name: "Mexico City", city: "Mexico", country: "Mexique", lat: 19.4361, lng: -99.0719, tier: 1 },
  { skyId: "CUN", entityId: "95565084", name: "Cancún", city: "Cancún", country: "Mexique", lat: 21.0366, lng: -86.8770, tier: 2 },
  { skyId: "GRU", entityId: "95565081", name: "São Paulo Guarulhos", city: "São Paulo", country: "Brésil", lat: -23.4356, lng: -46.4731, tier: 1 },
  { skyId: "GIG", entityId: "95565082", name: "Rio de Janeiro", city: "Rio de Janeiro", country: "Brésil", lat: -22.8100, lng: -43.2505, tier: 2 },
  { skyId: "EZE", entityId: "95565083", name: "Buenos Aires", city: "Buenos Aires", country: "Argentine", lat: -34.8122, lng: -58.5398, tier: 2 },
  { skyId: "BOG", entityId: "95565084", name: "Bogota", city: "Bogota", country: "Colombie", lat: 4.7016, lng: -74.1469, tier: 2 },
  { skyId: "CTG", entityId: "95565141", name: "Carthagène", city: "Carthagène", country: "Colombie", lat: 10.4424, lng: -75.5130, tier: 3 },
  { skyId: "SCL", entityId: "95565085", name: "Santiago", city: "Santiago", country: "Chili", lat: -33.3930, lng: -70.7858, tier: 2 },
  { skyId: "LIM", entityId: "95565086", name: "Lima", city: "Lima", country: "Pérou", lat: -12.0219, lng: -77.1143, tier: 2 },
  { skyId: "CUZ", entityId: "95565142", name: "Cuzco", city: "Cuzco", country: "Pérou", lat: -13.5357, lng: -71.9388, tier: 3 },
  { skyId: "PUJ", entityId: "95565086", name: "Punta Cana", city: "Punta Cana", country: "Rép. Dominicaine", lat: 18.5674, lng: -68.3634, tier: 2 },
  { skyId: "HAV", entityId: "95565116", name: "La Havane", city: "La Havane", country: "Cuba", lat: 22.9892, lng: -82.4091, tier: 2 },
  { skyId: "SJU", entityId: "95565143", name: "San Juan", city: "San Juan", country: "Porto Rico", lat: 18.4394, lng: -66.0018, tier: 3 },
  { skyId: "NAS", entityId: "95565144", name: "Nassau", city: "Nassau", country: "Bahamas", lat: 25.0390, lng: -77.4662, tier: 3 },
  { skyId: "SJO", entityId: "95565145", name: "San José", city: "San José", country: "Costa Rica", lat: 9.9938, lng: -84.2088, tier: 3 },
  { skyId: "SID", entityId: "95565146", name: "Amílcar Cabral (Sal)", city: "Sal", country: "Cap-Vert", lat: 16.7329, lng: -22.9494, tier: 2 },
  { skyId: "RAI", entityId: "95565147", name: "Nelson Mandela (Praia)", city: "Praia", country: "Cap-Vert", lat: 14.9244, lng: -23.4862, tier: 3 },
  { skyId: "BVC", entityId: "95565148", name: "Rabil (Boa Vista)", city: "Boa Vista", country: "Cap-Vert", lat: 16.1367, lng: -22.8896, tier: 3 },
  { skyId: "CAI", entityId: "95565092", name: "Le Caire", city: "Le Caire", country: "Égypte", lat: 30.1219, lng: 31.4056, tier: 1 },
  { skyId: "HRG", entityId: "95565149", name: "Hurghada", city: "Hurghada", country: "Égypte", lat: 27.1783, lng: 33.7994, tier: 3 },
  { skyId: "CMN", entityId: "95565093", name: "Casablanca", city: "Casablanca", country: "Maroc", lat: 33.3672, lng: -7.5899, tier: 2 },
  { skyId: "RAK", entityId: "95565094", name: "Marrakech", city: "Marrakech", country: "Maroc", lat: 31.6069, lng: -8.0363, tier: 2 },
  { skyId: "AGA", entityId: "95565150", name: "Agadir", city: "Agadir", country: "Maroc", lat: 30.3250, lng: -9.4131, tier: 3 },
  { skyId: "TUN", entityId: "95565118", name: "Tunis", city: "Tunis", country: "Tunisie", lat: 36.8510, lng: 10.2272, tier: 2 },
  { skyId: "DJE", entityId: "95565151", name: "Djerba", city: "Djerba", country: "Tunisie", lat: 33.8750, lng: 10.7755, tier: 3 },
  { skyId: "DKR", entityId: "95565152", name: "Dakar", city: "Dakar", country: "Sénégal", lat: 14.6711, lng: -17.0733, tier: 2 },
  { skyId: "ABJ", entityId: "95565153", name: "Abidjan", city: "Abidjan", country: "Côte d'Ivoire", lat: 5.2614, lng: -3.9263, tier: 2 },
  { skyId: "LOS", entityId: "95565154", name: "Lagos", city: "Lagos", country: "Nigeria", lat: 6.5774, lng: 3.3215, tier: 2 },
  { skyId: "NBO", entityId: "95565155", name: "Nairobi", city: "Nairobi", country: "Kenya", lat: -1.3192, lng: 36.9278, tier: 2 },
  { skyId: "JNB", entityId: "95565094", name: "Johannesburg", city: "Johannesburg", country: "Afrique du Sud", lat: -26.1366, lng: 28.2411, tier: 1 },
  { skyId: "CPT", entityId: "95565095", name: "Le Cap", city: "Le Cap", country: "Afrique du Sud", lat: -33.9715, lng: 18.6021, tier: 2 },
  { skyId: "MRU", entityId: "95565119", name: "Île Maurice", city: "Port-Louis", country: "Maurice", lat: -20.4302, lng: 57.6836, tier: 2 },
  { skyId: "SEZ", entityId: "95565156", name: "Seychelles", city: "Mahé", country: "Seychelles", lat: -4.6743, lng: 55.5219, tier: 3 },
  { skyId: "ZNZ", entityId: "95565157", name: "Zanzibar", city: "Zanzibar", country: "Tanzanie", lat: -6.2220, lng: 39.2246, tier: 3 },
  { skyId: "DXB", entityId: "95565063", name: "Dubaï", city: "Dubaï", country: "Émirats Arabes Unis", lat: 25.2532, lng: 55.3657, tier: 1 },
  { skyId: "AUH", entityId: "95565064", name: "Abu Dhabi", city: "Abu Dhabi", country: "Émirats Arabes Unis", lat: 24.4330, lng: 54.6511, tier: 2 },
  { skyId: "DOH", entityId: "95565091", name: "Doha Hamad", city: "Doha", country: "Qatar", lat: 25.2730, lng: 51.6080, tier: 2 },
  { skyId: "RUH", entityId: "95565092", name: "Riyad", city: "Riyad", country: "Arabie Saoudite", lat: 24.9576, lng: 46.6988, tier: 2 },
  { skyId: "JED", entityId: "95565093", name: "Djeddah", city: "Djeddah", country: "Arabie Saoudite", lat: 21.6796, lng: 39.1565, tier: 2 },
  { skyId: "AMM", entityId: "95565158", name: "Amman", city: "Amman", country: "Jordanie", lat: 31.7226, lng: 35.9932, tier: 3 },
  { skyId: "MLE", entityId: "95565159", name: "Malé (Maldives)", city: "Malé", country: "Maldives", lat: 4.1918, lng: 73.5291, tier: 2 },
  { skyId: "HND", entityId: "95565061", name: "Tokyo Haneda", city: "Tokyo", country: "Japon", lat: 35.5494, lng: 139.7798, tier: 1 },
  { skyId: "NRT", entityId: "95565160", name: "Tokyo Narita", city: "Tokyo", country: "Japon", lat: 35.7647, lng: 140.3863, tier: 2 },
  { skyId: "KIX", entityId: "95565062", name: "Osaka Kansai", city: "Osaka", country: "Japon", lat: 34.4320, lng: 135.2304, tier: 2 },
  { skyId: "ICN", entityId: "95565085", name: "Séoul Incheon", city: "Séoul", country: "Corée du Sud", lat: 37.4601, lng: 126.4406, tier: 1 },
  { skyId: "PEK", entityId: "95565086", name: "Pékin", city: "Pékin", country: "Chine", lat: 40.0798, lng: 116.6031, tier: 1 },
  { skyId: "PVG", entityId: "95565087", name: "Shanghai Pudong", city: "Shanghai", country: "Chine", lat: 31.1443, lng: 121.8083, tier: 1 },
  { skyId: "HKG", entityId: "95565087", name: "Hong Kong", city: "Hong Kong", country: "Hong Kong", lat: 22.3080, lng: 113.9184, tier: 1 },
  { skyId: "TPE", entityId: "95565161", name: "Taipei", city: "Taipei", country: "Taïwan", lat: 25.0777, lng: 121.2328, tier: 2 },
  { skyId: "BKK", entityId: "95565088", name: "Bangkok", city: "Bangkok", country: "Thaïlande", lat: 13.6900, lng: 100.7501, tier: 1 },
  { skyId: "HKT", entityId: "95565089", name: "Phuket", city: "Phuket", country: "Thaïlande", lat: 8.1132, lng: 98.3169, tier: 2 },
  { skyId: "USM", entityId: "95565162", name: "Koh Samui", city: "Koh Samui", country: "Thaïlande", lat: 9.5478, lng: 100.0617, tier: 3 },
  { skyId: "SIN", entityId: "95565089", name: "Singapour", city: "Singapour", country: "Singapour", lat: 1.3644, lng: 103.9915, tier: 1 },
  { skyId: "DPS", entityId: "95565090", name: "Bali", city: "Denpasar", country: "Indonésie", lat: -8.7481, lng: 115.1671, tier: 2 },
  { skyId: "CGK", entityId: "95565117", name: "Jakarta", city: "Jakarta", country: "Indonésie", lat: -6.1256, lng: 106.6558, tier: 2 },
  { skyId: "KUL", entityId: "95565091", name: "Kuala Lumpur", city: "Kuala Lumpur", country: "Malaisie", lat: 2.7456, lng: 101.7099, tier: 2 },
  { skyId: "SGN", entityId: "95565163", name: "Hô Chi Minh Ville", city: "Hô Chi Minh Ville", country: "Vietnam", lat: 10.8188, lng: 106.6519, tier: 2 },
  { skyId: "HAN", entityId: "95565164", name: "Hanoï", city: "Hanoï", country: "Vietnam", lat: 21.2212, lng: 105.8072, tier: 3 },
  { skyId: "MNL", entityId: "95565165", name: "Manille", city: "Manille", country: "Philippines", lat: 14.5086, lng: 121.0194, tier: 2 },
  { skyId: "DEL", entityId: "95565092", name: "New Delhi", city: "New Delhi", country: "Inde", lat: 28.5562, lng: 77.1000, tier: 1 },
  { skyId: "BOM", entityId: "95565093", name: "Mumbai", city: "Mumbai", country: "Inde", lat: 19.0896, lng: 72.8656, tier: 2 },
  { skyId: "SYD", entityId: "95565064", name: "Sydney", city: "Sydney", country: "Australie", lat: -33.9399, lng: 151.1753, tier: 1 },
  { skyId: "MEL", entityId: "95565095", name: "Melbourne", city: "Melbourne", country: "Australie", lat: -37.6690, lng: 144.8410, tier: 2 },
  { skyId: "BNE", entityId: "95565096", name: "Brisbane", city: "Brisbane", country: "Australie", lat: -27.3842, lng: 153.1175, tier: 2 },
  { skyId: "PER", entityId: "95565166", name: "Perth", city: "Perth", country: "Australie", lat: -31.9403, lng: 115.9669, tier: 3 },
  { skyId: "AKL", entityId: "95565096", name: "Auckland", city: "Auckland", country: "Nouvelle-Zélande", lat: -37.0082, lng: 174.7916, tier: 2 },
  { skyId: "CHC", entityId: "95565167", name: "Christchurch", city: "Christchurch", country: "Nouvelle-Zélande", lat: -43.4864, lng: 172.5369, tier: 3 },
  { skyId: "NAN", entityId: "95565097", name: "Nadi", city: "Nadi", country: "Fidji", lat: -17.7554, lng: 177.4430, tier: 3 }
];

export function findNearestAirport(userLat: number, userLng: number): MapAirport {
  let nearest = STATIC_AIRPORTS[0];
  let minDistance = Infinity;

  STATIC_AIRPORTS.forEach((airport) => {
    const radlat1 = (Math.PI * userLat) / 180;
    const radlat2 = (Math.PI * airport.lat) / 180;
    const theta = userLng - airport.lng;
    const radtheta = (Math.PI * theta) / 180;

    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344;

    if (dist < minDistance) {
      minDistance = dist;
      nearest = airport;
    }
  });

  return nearest;
}

/*
 * INTERFACE HYPER-RÉSILIENTE
 * Gère à la fois les majuscules et minuscules pour que le code
 * ne crashe plus si le JSON externe change le nom de ses variables.
 */
interface RawGitHubAirport {
  IATA?: string;
  iata?: string;
  code?: string;
  name?: string;
  city?: string;
  country?: string;
  iso?: string;
  latitude?: string | number;
  lat?: string | number;
  longitude?: string | number;
  lon?: string | number;
  lng?: string | number;
}

let cachedGlobalAirports: MapAirport[] | null = null;

/*
 * TÉLÉCHARGEMENT ASYNCHRONE DE LA BASE DE DONNÉES MONDIALE
 */
export async function getGlobalAirports(): Promise<MapAirport[]> {
  if (cachedGlobalAirports) {
    return cachedGlobalAirports;
  }

  try {
    const response = await fetch('https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json');
    const data: RawGitHubAirport[] = await response.json();

    const existingIatas = new Set(STATIC_AIRPORTS.map(a => a.skyId));
    
    const normalizedAirports: MapAirport[] = data.map((a) => {
      const codeIata = a.IATA || a.iata || a.code || '';
      const latitude = a.latitude || a.lat;
      const longitude = a.longitude || a.lon || a.lng;
      const pays = a.country || a.iso || 'Inconnu';
      const ville = a.city || a.name || 'Inconnu';
      
      return {
        skyId: codeIata.toUpperCase(),
        entityId: codeIata.toUpperCase(),
        name: a.name || 'Aéroport inconnu',
        city: ville,
        country: pays,
        lat: Number(latitude), 
        lng: Number(longitude),
        tier: 3
      };
    });

    const newAirports = normalizedAirports.filter((a) => {
      // FILTRE STRICT : On jette tout ce qui s'appelle "Inconnu" ou qui n'a pas de ville
      const isUnknown = a.city.toLowerCase().includes('inconnu') || a.name.toLowerCase().includes('inconnu');
      
      return a.skyId.length === 3 && 
             !existingIatas.has(a.skyId) && 
             !isNaN(a.lat) && 
             !isNaN(a.lng) &&
             a.lat !== 0 && 
             a.lng !== 0 &&
             !isUnknown; // La magie opère ici !
    });

    cachedGlobalAirports = [...STATIC_AIRPORTS, ...newAirports];
    console.log(`✈️ Succès : ${newAirports.length} vrais aéroports supplémentaires chargés !`);
    
    return cachedGlobalAirports;
  } catch (error) {
    console.error("Erreur lors du téléchargement des aéroports mondiaux:", error);
    return STATIC_AIRPORTS;
  }
}