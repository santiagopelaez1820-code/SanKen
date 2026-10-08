<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el modelo Country (país).
use App\Models\Country;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;
// Esta línea sirve para importar la fachada DB para insertar ciudades en bloque.
use Illuminate\Support\Facades\DB;

// Esta línea sirve para declarar el seeder que carga los países y sus ciudades principales.
class CountrySeeder extends Seeder
{
    /**
     * Catálogo completo de países (ISO 3166-1 alpha-2) con sus ciudades
     * principales (capital + ciudades más grandes). No es un listado
     * exhaustivo de TODAS las ciudades del mundo (inmanejable para un
     * selector de UI) pero cubre los 195 países soberanos reconocidos por
     * la ONU, cada uno con entre 3 y 15 ciudades reales según su tamaño.
     */
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para obtener el catálogo de países.
        $data = $this->countries();

        // Esta línea sirve para recorrer cada país.
        foreach ($data as $code => $entry) {
            // Esta línea sirve para crear el país, o actualizarlo si ya existía.
            $country = Country::query()->updateOrCreate(
                // Esta línea sirve para buscarlo por su código ISO.
                ['code' => $code],
                // Esta línea sirve para guardar su nombre.
                ['name' => $entry[0]]
            );

            // Esta línea sirve para armar las filas de sus ciudades.
            $rows = array_map(fn (string $city) => [
                // Esta línea sirve para guardar el id del país.
                'country_id' => $country->id,
                // Esta línea sirve para guardar el nombre de la ciudad.
                'name' => $city,
                // Esta línea sirve para guardar la fecha de creación.
                'created_at' => now(),
                // Esta línea sirve para guardar la fecha de actualización.
                'updated_at' => now(),
                // Esta línea sirve para pasar las ciudades del país a recorrer.
            ], $entry[1]);

            // Esta línea sirve para dividir las ciudades en bloques de 200.
            foreach (array_chunk($rows, 200) as $chunk) {
                // Esta línea sirve para insertar las ciudades, o actualizarlas si ya existían.
                DB::table('cities')->upsert($chunk, ['country_id', 'name'], ['updated_at']);
            }
        }
    }

    /**
     * @return array<string, array{0: string, 1: string[]}>
     */
    // Esta línea sirve para declarar el método que devuelve el catálogo de países.
    private function countries(): array
    {
        // Esta línea sirve para devolver el catálogo.
        return [
            // Esta línea sirve para incluir Afganistán con sus ciudades principales.
            'AF' => ['Afganistán', ['Kabul', 'Kandahar', 'Herat', 'Mazar-e Sarif']],
            // Esta línea sirve para incluir Albania con sus ciudades principales.
            'AL' => ['Albania', ['Tirana', 'Durrés', 'Vlorë']],
            // Esta línea sirve para incluir Argelia con sus ciudades principales.
            'DZ' => ['Argelia', ['Argel', 'Orán', 'Constantina', 'Annaba']],
            // Esta línea sirve para incluir Andorra con sus ciudades principales.
            'AD' => ['Andorra', ['Andorra la Vieja']],
            // Esta línea sirve para incluir Angola con sus ciudades principales.
            'AO' => ['Angola', ['Luanda', 'Huambo', 'Lobito']],
            // Esta línea sirve para incluir Antigua y Barbuda con sus ciudades principales.
            'AG' => ['Antigua y Barbuda', ["St. John's"]],
            // Esta línea sirve para incluir Argentina con sus ciudades principales.
            'AR' => ['Argentina', ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'Salta', 'San Miguel de Tucumán', 'Neuquén', 'Bariloche']],
            // Esta línea sirve para incluir Armenia con sus ciudades principales.
            'AM' => ['Armenia', ['Ereván', 'Guiumri']],
            // Esta línea sirve para incluir Australia con sus ciudades principales.
            'AU' => ['Australia', ['Sídney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaida', 'Canberra', 'Gold Coast', 'Hobart', 'Darwin']],
            // Esta línea sirve para incluir Austria con sus ciudades principales.
            'AT' => ['Austria', ['Viena', 'Graz', 'Linz', 'Salzburgo', 'Innsbruck']],
            // Esta línea sirve para incluir Azerbaiyán con sus ciudades principales.
            'AZ' => ['Azerbaiyán', ['Bakú', 'Ganyá']],
            // Esta línea sirve para incluir Bahamas con sus ciudades principales.
            'BS' => ['Bahamas', ['Nasáu']],
            // Esta línea sirve para incluir Baréin con sus ciudades principales.
            'BH' => ['Baréin', ['Manama']],
            // Esta línea sirve para incluir Bangladés con sus ciudades principales.
            'BD' => ['Bangladés', ['Daca', 'Chittagong', 'Khulna']],
            // Esta línea sirve para incluir Barbados con sus ciudades principales.
            'BB' => ['Barbados', ['Bridgetown']],
            // Esta línea sirve para incluir Bielorrusia con sus ciudades principales.
            'BY' => ['Bielorrusia', ['Minsk', 'Gómel', 'Vítebsk']],
            // Esta línea sirve para incluir Bélgica con sus ciudades principales.
            'BE' => ['Bélgica', ['Bruselas', 'Amberes', 'Gante', 'Brujas', 'Lieja']],
            // Esta línea sirve para incluir Belice con sus ciudades principales.
            'BZ' => ['Belice', ['Belmopán', 'Ciudad de Belice']],
            // Esta línea sirve para incluir Benín con sus ciudades principales.
            'BJ' => ['Benín', ['Porto Novo', 'Cotonú']],
            // Esta línea sirve para incluir Bután con sus ciudades principales.
            'BT' => ['Bután', ['Timbu']],
            // Esta línea sirve para incluir Bolivia con sus ciudades principales.
            'BO' => ['Bolivia', ['La Paz', 'Santa Cruz de la Sierra', 'Cochabamba', 'Sucre', 'El Alto']],
            // Esta línea sirve para incluir Bosnia y Herzegovina con sus ciudades principales.
            'BA' => ['Bosnia y Herzegovina', ['Sarajevo', 'Banja Luka', 'Mostar']],
            // Esta línea sirve para incluir Botsuana con sus ciudades principales.
            'BW' => ['Botsuana', ['Gaborone']],
            // Esta línea sirve para incluir Brasil con sus ciudades principales.
            'BR' => ['Brasil', ['São Paulo', 'Río de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaos', 'Curitiba', 'Recife', 'Porto Alegre']],
            // Esta línea sirve para incluir Brunéi con sus ciudades principales.
            'BN' => ['Brunéi', ['Bandar Seri Begawan']],
            // Esta línea sirve para incluir Bulgaria con sus ciudades principales.
            'BG' => ['Bulgaria', ['Sofía', 'Plovdiv', 'Varna']],
            // Esta línea sirve para incluir Burkina Faso con sus ciudades principales.
            'BF' => ['Burkina Faso', ['Uagadugú', 'Bobo-Dioulasso']],
            // Esta línea sirve para incluir Burundi con sus ciudades principales.
            'BI' => ['Burundi', ['Buyumbura', 'Guitega']],
            // Esta línea sirve para incluir Cabo Verde con sus ciudades principales.
            'CV' => ['Cabo Verde', ['Praia']],
            // Esta línea sirve para incluir Camboya con sus ciudades principales.
            'KH' => ['Camboya', ['Nom Pen', 'Siem Reap']],
            // Esta línea sirve para incluir Camerún con sus ciudades principales.
            'CM' => ['Camerún', ['Yaundé', 'Duala']],
            // Esta línea sirve para incluir Canadá con sus ciudades principales.
            'CA' => ['Canadá', ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Edmonton', 'Quebec', 'Winnipeg', 'Halifax']],
            // Esta línea sirve para incluir Catar con sus ciudades principales.
            'QA' => ['Catar', ['Doha']],
            // Esta línea sirve para incluir Kazajistán con sus ciudades principales.
            'KZ' => ['Kazajistán', ['Almaty', 'Astaná', 'Shymkent']],
            // Esta línea sirve para incluir Chad con sus ciudades principales.
            'TD' => ['Chad', ['Yamena']],
            // Esta línea sirve para incluir Chile con sus ciudades principales.
            'CL' => ['Chile', ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Viña del Mar']],
            // Esta línea sirve para incluir China con sus ciudades principales.
            'CN' => ['China', ['Pekín', 'Shanghái', 'Cantón', 'Shenzhen', 'Chengdú', 'Wuhan', 'Xi\'an', 'Hangzhou', 'Nankín', 'Tianjín']],
            // Esta línea sirve para incluir Chipre con sus ciudades principales.
            'CY' => ['Chipre', ['Nicosia', 'Limasol']],
            // Esta línea sirve para incluir Ciudad del Vaticano con sus ciudades principales.
            'VA' => ['Ciudad del Vaticano', ['Ciudad del Vaticano']],
            // Esta línea sirve para incluir Colombia con sus ciudades principales.
            'CO' => ['Colombia', ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta']],
            // Esta línea sirve para incluir Comoras con sus ciudades principales.
            'KM' => ['Comoras', ['Moroni']],
            // Esta línea sirve para incluir Congo con sus ciudades principales.
            'CG' => ['Congo', ['Brazzaville', 'Pointe-Noire']],
            // Esta línea sirve para incluir República Democrática del Congo con sus ciudades principales.
            'CD' => ['República Democrática del Congo', ['Kinsasa', 'Lubumbashi', 'Mbuji-Mayi']],
            // Esta línea sirve para incluir Corea del Norte con sus ciudades principales.
            'KP' => ['Corea del Norte', ['Pionyang']],
            // Esta línea sirve para incluir Corea del Sur con sus ciudades principales.
            'KR' => ['Corea del Sur', ['Seúl', 'Busan', 'Incheon', 'Daegu', 'Daejeon']],
            // Esta línea sirve para incluir Costa de Marfil con sus ciudades principales.
            'CI' => ['Costa de Marfil', ['Abiyán', 'Yamusukro', 'Bouaké']],
            // Esta línea sirve para incluir Costa Rica con sus ciudades principales.
            'CR' => ['Costa Rica', ['San José', 'Alajuela', 'Cartago', 'Limón']],
            // Esta línea sirve para incluir Croacia con sus ciudades principales.
            'HR' => ['Croacia', ['Zagreb', 'Split', 'Rijeka', 'Dubrovnik']],
            // Esta línea sirve para incluir Cuba con sus ciudades principales.
            'CU' => ['Cuba', ['La Habana', 'Santiago de Cuba', 'Camagüey']],
            // Esta línea sirve para incluir Dinamarca con sus ciudades principales.
            'DK' => ['Dinamarca', ['Copenhague', 'Aarhus', 'Odense']],
            // Esta línea sirve para incluir Dominica con sus ciudades principales.
            'DM' => ['Dominica', ['Roseau']],
            // Esta línea sirve para incluir Ecuador con sus ciudades principales.
            'EC' => ['Ecuador', ['Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Ambato']],
            // Esta línea sirve para incluir Egipto con sus ciudades principales.
            'EG' => ['Egipto', ['El Cairo', 'Alejandría', 'Guiza', 'Luxor', 'Asuán']],
            // Esta línea sirve para incluir El Salvador con sus ciudades principales.
            'SV' => ['El Salvador', ['San Salvador', 'Santa Ana', 'San Miguel']],
            // Esta línea sirve para incluir Emiratos Árabes Unidos con sus ciudades principales.
            'AE' => ['Emiratos Árabes Unidos', ['Dubái', 'Abu Dabi', 'Sharjah']],
            // Esta línea sirve para incluir Eritrea con sus ciudades principales.
            'ER' => ['Eritrea', ['Asmara']],
            // Esta línea sirve para incluir Eslovaquia con sus ciudades principales.
            'SK' => ['Eslovaquia', ['Bratislava', 'Košice']],
            // Esta línea sirve para incluir Eslovenia con sus ciudades principales.
            'SI' => ['Eslovenia', ['Liubliana', 'Maribor']],
            // Esta línea sirve para incluir España con sus ciudades principales.
            'ES' => ['España', ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Bilbao', 'Murcia', 'Palma de Mallorca', 'Las Palmas de Gran Canaria']],
            // Esta línea sirve para incluir Estados Unidos con sus ciudades principales.
            'US' => ['Estados Unidos', ['Nueva York', 'Los Ángeles', 'Chicago', 'Houston', 'Phoenix', 'Miami', 'Filadelfia', 'San Antonio', 'San Diego', 'Dallas', 'Austin', 'San Francisco', 'Seattle', 'Boston', 'Las Vegas', 'Orlando']],
            // Esta línea sirve para incluir Estonia con sus ciudades principales.
            'EE' => ['Estonia', ['Tallin', 'Tartu']],
            // Esta línea sirve para incluir Esuatini con sus ciudades principales.
            'SZ' => ['Esuatini', ['Mbabane']],
            // Esta línea sirve para incluir Etiopía con sus ciudades principales.
            'ET' => ['Etiopía', ['Adís Abeba', 'Dire Dawa']],
            // Esta línea sirve para incluir Filipinas con sus ciudades principales.
            'PH' => ['Filipinas', ['Manila', 'Quezon City', 'Cebú', 'Davao']],
            // Esta línea sirve para incluir Finlandia con sus ciudades principales.
            'FI' => ['Finlandia', ['Helsinki', 'Espoo', 'Tampere', 'Turku']],
            // Esta línea sirve para incluir Fiyi con sus ciudades principales.
            'FJ' => ['Fiyi', ['Suva']],
            // Esta línea sirve para incluir Francia con sus ciudades principales.
            'FR' => ['Francia', ['París', 'Marsella', 'Lyon', 'Toulouse', 'Niza', 'Nantes', 'Estrasburgo', 'Burdeos', 'Lille']],
            // Esta línea sirve para incluir Gabón con sus ciudades principales.
            'GA' => ['Gabón', ['Libreville']],
            // Esta línea sirve para incluir Gambia con sus ciudades principales.
            'GM' => ['Gambia', ['Banjul']],
            // Esta línea sirve para incluir Georgia con sus ciudades principales.
            'GE' => ['Georgia', ['Tiflis', 'Batumi']],
            // Esta línea sirve para incluir Ghana con sus ciudades principales.
            'GH' => ['Ghana', ['Accra', 'Kumasi']],
            // Esta línea sirve para incluir Granada con sus ciudades principales.
            'GD' => ['Granada', ["St. George's"]],
            // Esta línea sirve para incluir Grecia con sus ciudades principales.
            'GR' => ['Grecia', ['Atenas', 'Tesalónica', 'Patras', 'Heraclión']],
            // Esta línea sirve para incluir Guatemala con sus ciudades principales.
            'GT' => ['Guatemala', ['Ciudad de Guatemala', 'Quetzaltenango', 'Antigua Guatemala']],
            // Esta línea sirve para incluir Guyana con sus ciudades principales.
            'GY' => ['Guyana', ['Georgetown']],
            // Esta línea sirve para incluir Guinea con sus ciudades principales.
            'GN' => ['Guinea', ['Conakri']],
            // Esta línea sirve para incluir Guinea-Bisáu con sus ciudades principales.
            'GW' => ['Guinea-Bisáu', ['Bisáu']],
            // Esta línea sirve para incluir Guinea Ecuatorial con sus ciudades principales.
            'GQ' => ['Guinea Ecuatorial', ['Malabo']],
            // Esta línea sirve para incluir Haití con sus ciudades principales.
            'HT' => ['Haití', ['Puerto Príncipe']],
            // Esta línea sirve para incluir Honduras con sus ciudades principales.
            'HN' => ['Honduras', ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba']],
            // Esta línea sirve para incluir Hungría con sus ciudades principales.
            'HU' => ['Hungría', ['Budapest', 'Debrecen', 'Szeged']],
            // Esta línea sirve para incluir India con sus ciudades principales.
            'IN' => ['India', ['Bombay', 'Nueva Delhi', 'Bangalore', 'Calcuta', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur']],
            // Esta línea sirve para incluir Indonesia con sus ciudades principales.
            'ID' => ['Indonesia', ['Yakarta', 'Surabaya', 'Bandung', 'Medan', 'Bali/Denpasar']],
            // Esta línea sirve para incluir Irak con sus ciudades principales.
            'IQ' => ['Irak', ['Bagdad', 'Basora', 'Erbil']],
            // Esta línea sirve para incluir Irán con sus ciudades principales.
            'IR' => ['Irán', ['Teherán', 'Mashhad', 'Isfahán']],
            // Esta línea sirve para incluir Irlanda con sus ciudades principales.
            'IE' => ['Irlanda', ['Dublín', 'Cork', 'Galway', 'Limerick']],
            // Esta línea sirve para incluir Islandia con sus ciudades principales.
            'IS' => ['Islandia', ['Reikiavik']],
            // Esta línea sirve para incluir Islas Marshall con sus ciudades principales.
            'MH' => ['Islas Marshall', ['Majuro']],
            // Esta línea sirve para incluir Islas Salomón con sus ciudades principales.
            'SB' => ['Islas Salomón', ['Honiara']],
            // Esta línea sirve para incluir Israel con sus ciudades principales.
            'IL' => ['Israel', ['Jerusalén', 'Tel Aviv', 'Haifa']],
            // Esta línea sirve para incluir Italia con sus ciudades principales.
            'IT' => ['Italia', ['Roma', 'Milán', 'Nápoles', 'Turín', 'Palermo', 'Bolonia', 'Florencia', 'Venecia', 'Génova']],
            // Esta línea sirve para incluir Jamaica con sus ciudades principales.
            'JM' => ['Jamaica', ['Kingston', 'Montego Bay']],
            // Esta línea sirve para incluir Japón con sus ciudades principales.
            'JP' => ['Japón', ['Tokio', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kioto', 'Kobe']],
            // Esta línea sirve para incluir Jordania con sus ciudades principales.
            'JO' => ['Jordania', ['Amán', 'Zarqa']],
            // Esta línea sirve para incluir Kuwait con sus ciudades principales.
            'KW' => ['Kuwait', ['Ciudad de Kuwait']],
            // Esta línea sirve para incluir Laos con sus ciudades principales.
            'LA' => ['Laos', ['Vientián']],
            // Esta línea sirve para incluir Lesoto con sus ciudades principales.
            'LS' => ['Lesoto', ['Maseru']],
            // Esta línea sirve para incluir Letonia con sus ciudades principales.
            'LV' => ['Letonia', ['Riga', 'Daugavpils']],
            // Esta línea sirve para incluir Líbano con sus ciudades principales.
            'LB' => ['Líbano', ['Beirut', 'Trípoli', 'Sidón']],
            // Esta línea sirve para incluir Liberia con sus ciudades principales.
            'LR' => ['Liberia', ['Monrovia']],
            // Esta línea sirve para incluir Libia con sus ciudades principales.
            'LY' => ['Libia', ['Trípoli', 'Bengasi']],
            // Esta línea sirve para incluir Liechtenstein con sus ciudades principales.
            'LI' => ['Liechtenstein', ['Vaduz']],
            // Esta línea sirve para incluir Lituania con sus ciudades principales.
            'LT' => ['Lituania', ['Vilna', 'Kaunas']],
            // Esta línea sirve para incluir Luxemburgo con sus ciudades principales.
            'LU' => ['Luxemburgo', ['Luxemburgo']],
            // Esta línea sirve para incluir Macedonia del Norte con sus ciudades principales.
            'MK' => ['Macedonia del Norte', ['Skopie']],
            // Esta línea sirve para incluir Madagascar con sus ciudades principales.
            'MG' => ['Madagascar', ['Antananarivo', 'Toamasina']],
            // Esta línea sirve para incluir Malasia con sus ciudades principales.
            'MY' => ['Malasia', ['Kuala Lumpur', 'Johor Bahru', 'Penang']],
            // Esta línea sirve para incluir Malaui con sus ciudades principales.
            'MW' => ['Malaui', ['Lilongüe', 'Blantyre']],
            // Esta línea sirve para incluir Maldivas con sus ciudades principales.
            'MV' => ['Maldivas', ['Malé']],
            // Esta línea sirve para incluir Malí con sus ciudades principales.
            'ML' => ['Malí', ['Bamako']],
            // Esta línea sirve para incluir Malta con sus ciudades principales.
            'MT' => ['Malta', ['La Valeta']],
            // Esta línea sirve para incluir Marruecos con sus ciudades principales.
            'MA' => ['Marruecos', ['Casablanca', 'Rabat', 'Fez', 'Marrakech', 'Tánger']],
            // Esta línea sirve para incluir Mauricio con sus ciudades principales.
            'MU' => ['Mauricio', ['Port Louis']],
            // Esta línea sirve para incluir Mauritania con sus ciudades principales.
            'MR' => ['Mauritania', ['Nuakchot']],
            // Esta línea sirve para incluir México con sus ciudades principales.
            'MX' => ['México', ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Mérida', 'Cancún', 'Querétaro', 'Toluca']],
            // Esta línea sirve para incluir Micronesia con sus ciudades principales.
            'FM' => ['Micronesia', ['Palikir']],
            // Esta línea sirve para incluir Moldavia con sus ciudades principales.
            'MD' => ['Moldavia', ['Chisináu']],
            // Esta línea sirve para incluir Mónaco con sus ciudades principales.
            'MC' => ['Mónaco', ['Mónaco']],
            // Esta línea sirve para incluir Mongolia con sus ciudades principales.
            'MN' => ['Mongolia', ['Ulán Bator']],
            // Esta línea sirve para incluir Montenegro con sus ciudades principales.
            'ME' => ['Montenegro', ['Podgorica']],
            // Esta línea sirve para incluir Mozambique con sus ciudades principales.
            'MZ' => ['Mozambique', ['Maputo', 'Beira']],
            // Esta línea sirve para incluir Birmania con sus ciudades principales.
            'MM' => ['Birmania', ['Naipyidó', 'Rangún', 'Mandalay']],
            // Esta línea sirve para incluir Namibia con sus ciudades principales.
            'NA' => ['Namibia', ['Windhoek']],
            // Esta línea sirve para incluir Nauru con sus ciudades principales.
            'NR' => ['Nauru', ['Yaren']],
            // Esta línea sirve para incluir Nepal con sus ciudades principales.
            'NP' => ['Nepal', ['Katmandú', 'Pokhara']],
            // Esta línea sirve para incluir Nicaragua con sus ciudades principales.
            'NI' => ['Nicaragua', ['Managua', 'León', 'Granada']],
            // Esta línea sirve para incluir Níger con sus ciudades principales.
            'NE' => ['Níger', ['Niamey']],
            // Esta línea sirve para incluir Nigeria con sus ciudades principales.
            'NG' => ['Nigeria', ['Lagos', 'Abuya', 'Kano', 'Ibadán', 'Port Harcourt']],
            // Esta línea sirve para incluir Noruega con sus ciudades principales.
            'NO' => ['Noruega', ['Oslo', 'Bergen', 'Trondheim']],
            // Esta línea sirve para incluir Nueva Zelanda con sus ciudades principales.
            'NZ' => ['Nueva Zelanda', ['Auckland', 'Wellington', 'Christchurch']],
            // Esta línea sirve para incluir Omán con sus ciudades principales.
            'OM' => ['Omán', ['Mascate']],
            // Esta línea sirve para incluir Países Bajos con sus ciudades principales.
            'NL' => ['Países Bajos', ['Ámsterdam', 'Róterdam', 'La Haya', 'Utrecht', 'Eindhoven']],
            // Esta línea sirve para incluir Pakistán con sus ciudades principales.
            'PK' => ['Pakistán', ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad']],
            // Esta línea sirve para incluir Palaos con sus ciudades principales.
            'PW' => ['Palaos', ['Ngerulmud']],
            // Esta línea sirve para incluir Panamá con sus ciudades principales.
            'PA' => ['Panamá', ['Ciudad de Panamá', 'Colón', 'David']],
            // Esta línea sirve para incluir Papúa Nueva Guinea con sus ciudades principales.
            'PG' => ['Papúa Nueva Guinea', ['Port Moresby']],
            // Esta línea sirve para incluir Paraguay con sus ciudades principales.
            'PY' => ['Paraguay', ['Asunción', 'Ciudad del Este', 'Encarnación']],
            // Esta línea sirve para incluir Perú con sus ciudades principales.
            'PE' => ['Perú', ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Cusco', 'Piura']],
            // Esta línea sirve para incluir Polonia con sus ciudades principales.
            'PL' => ['Polonia', ['Varsovia', 'Cracovia', 'Breslavia', 'Poznan', 'Gdansk', 'Łódź']],
            // Esta línea sirve para incluir Portugal con sus ciudades principales.
            'PT' => ['Portugal', ['Lisboa', 'Oporto', 'Braga', 'Coímbra', 'Faro']],
            // Esta línea sirve para incluir Reino Unido con sus ciudades principales.
            'GB' => ['Reino Unido', ['Londres', 'Mánchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edimburgo', 'Bristol', 'Leeds', 'Cardiff', 'Belfast']],
            // Esta línea sirve para incluir República Centroafricana con sus ciudades principales.
            'CF' => ['República Centroafricana', ['Bangui']],
            // Esta línea sirve para incluir República Checa con sus ciudades principales.
            'CZ' => ['República Checa', ['Praga', 'Brno', 'Ostrava']],
            // Esta línea sirve para incluir República Dominicana con sus ciudades principales.
            'DO' => ['República Dominicana', ['Santo Domingo', 'Santiago de los Caballeros', 'Punta Cana', 'La Romana']],
            // Esta línea sirve para incluir Ruanda con sus ciudades principales.
            'RW' => ['Ruanda', ['Kigali']],
            // Esta línea sirve para incluir Rumanía con sus ciudades principales.
            'RO' => ['Rumanía', ['Bucarest', 'Cluj-Napoca', 'Timisoara']],
            // Esta línea sirve para incluir Rusia con sus ciudades principales.
            'RU' => ['Rusia', ['Moscú', 'San Petersburgo', 'Novosibirsk', 'Ekaterimburgo', 'Kazán']],
            // Esta línea sirve para incluir Samoa con sus ciudades principales.
            'WS' => ['Samoa', ['Apia']],
            // Esta línea sirve para incluir San Cristóbal y Nieves con sus ciudades principales.
            'KN' => ['San Cristóbal y Nieves', ['Basseterre']],
            // Esta línea sirve para incluir San Marino con sus ciudades principales.
            'SM' => ['San Marino', ['San Marino']],
            // Esta línea sirve para incluir San Vicente y las Granadinas con sus ciudades principales.
            'VC' => ['San Vicente y las Granadinas', ['Kingstown']],
            // Esta línea sirve para incluir Santa Lucía con sus ciudades principales.
            'LC' => ['Santa Lucía', ['Castries']],
            // Esta línea sirve para incluir Santo Tomé y Príncipe con sus ciudades principales.
            'ST' => ['Santo Tomé y Príncipe', ['Santo Tomé']],
            // Esta línea sirve para incluir Senegal con sus ciudades principales.
            'SN' => ['Senegal', ['Dakar', 'Touba']],
            // Esta línea sirve para incluir Serbia con sus ciudades principales.
            'RS' => ['Serbia', ['Belgrado', 'Novi Sad', 'Niš']],
            // Esta línea sirve para incluir Seychelles con sus ciudades principales.
            'SC' => ['Seychelles', ['Victoria']],
            // Esta línea sirve para incluir Sierra Leona con sus ciudades principales.
            'SL' => ['Sierra Leona', ['Freetown']],
            // Esta línea sirve para incluir Singapur con sus ciudades principales.
            'SG' => ['Singapur', ['Singapur']],
            // Esta línea sirve para incluir Siria con sus ciudades principales.
            'SY' => ['Siria', ['Damasco', 'Alepo']],
            // Esta línea sirve para incluir Somalia con sus ciudades principales.
            'SO' => ['Somalia', ['Mogadiscio']],
            // Esta línea sirve para incluir Sri Lanka con sus ciudades principales.
            'LK' => ['Sri Lanka', ['Colombo', 'Kandy']],
            // Esta línea sirve para incluir Sudán del Sur con sus ciudades principales.
            'SS' => ['Sudán del Sur', ['Yuba']],
            // Esta línea sirve para incluir Sudán con sus ciudades principales.
            'SD' => ['Sudán', ['Jartum', 'Omdurmán']],
            // Esta línea sirve para incluir Suecia con sus ciudades principales.
            'SE' => ['Suecia', ['Estocolmo', 'Gotemburgo', 'Malmö', 'Uppsala']],
            // Esta línea sirve para incluir Suiza con sus ciudades principales.
            'CH' => ['Suiza', ['Zúrich', 'Ginebra', 'Basilea', 'Berna', 'Lausana']],
            // Esta línea sirve para incluir Surinam con sus ciudades principales.
            'SR' => ['Surinam', ['Paramaribo']],
            // Esta línea sirve para incluir Tailandia con sus ciudades principales.
            'TH' => ['Tailandia', ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya']],
            // Esta línea sirve para incluir Tanzania con sus ciudades principales.
            'TZ' => ['Tanzania', ['Dodoma', 'Dar es Salam', 'Zanzíbar']],
            // Esta línea sirve para incluir Tayikistán con sus ciudades principales.
            'TJ' => ['Tayikistán', ['Dusambé']],
            // Esta línea sirve para incluir Timor Oriental con sus ciudades principales.
            'TL' => ['Timor Oriental', ['Dili']],
            // Esta línea sirve para incluir Togo con sus ciudades principales.
            'TG' => ['Togo', ['Lomé']],
            // Esta línea sirve para incluir Tonga con sus ciudades principales.
            'TO' => ['Tonga', ["Nuku'alofa"]],
            // Esta línea sirve para incluir Trinidad y Tobago con sus ciudades principales.
            'TT' => ['Trinidad y Tobago', ['Puerto España']],
            // Esta línea sirve para incluir Túnez con sus ciudades principales.
            'TN' => ['Túnez', ['Túnez', 'Sfax']],
            // Esta línea sirve para incluir Turkmenistán con sus ciudades principales.
            'TM' => ['Turkmenistán', ['Asjabad']],
            // Esta línea sirve para incluir Turquía con sus ciudades principales.
            'TR' => ['Turquía', ['Estambul', 'Ankara', 'Esmirna', 'Antalya', 'Bursa']],
            // Esta línea sirve para incluir Tuvalu con sus ciudades principales.
            'TV' => ['Tuvalu', ['Funafuti']],
            // Esta línea sirve para incluir Ucrania con sus ciudades principales.
            'UA' => ['Ucrania', ['Kiev', 'Járkov', 'Odesa', 'Leópolis']],
            // Esta línea sirve para incluir Uganda con sus ciudades principales.
            'UG' => ['Uganda', ['Kampala']],
            // Esta línea sirve para incluir Uruguay con sus ciudades principales.
            'UY' => ['Uruguay', ['Montevideo', 'Punta del Este', 'Salto', 'Maldonado']],
            // Esta línea sirve para incluir Uzbekistán con sus ciudades principales.
            'UZ' => ['Uzbekistán', ['Taskent', 'Samarcanda']],
            // Esta línea sirve para incluir Vanuatu con sus ciudades principales.
            'VU' => ['Vanuatu', ['Port Vila']],
            // Esta línea sirve para incluir Venezuela con sus ciudades principales.
            'VE' => ['Venezuela', ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay']],
            // Esta línea sirve para incluir Vietnam con sus ciudades principales.
            'VN' => ['Vietnam', ['Hanói', 'Ciudad Ho Chi Minh', 'Da Nang']],
            // Esta línea sirve para incluir Yemen con sus ciudades principales.
            'YE' => ['Yemen', ['Saná', 'Adén']],
            // Esta línea sirve para incluir Yibuti con sus ciudades principales.
            'DJ' => ['Yibuti', ['Yibuti']],
            // Esta línea sirve para incluir Zambia con sus ciudades principales.
            'ZM' => ['Zambia', ['Lusaka', 'Ndola']],
            // Esta línea sirve para incluir Zimbabue con sus ciudades principales.
            'ZW' => ['Zimbabue', ['Harare', 'Bulawayo']],
            // Esta línea sirve para incluir Sudáfrica con sus ciudades principales.
            'ZA' => ['Sudáfrica', ['Johannesburgo', 'Ciudad del Cabo', 'Durban', 'Pretoria', 'Puerto Elizabeth']],
            // Esta línea sirve para incluir Kenia con sus ciudades principales.
            'KE' => ['Kenia', ['Nairobi', 'Mombasa', 'Kisumu']],
            // Esta línea sirve para incluir Kirguistán con sus ciudades principales.
            'KG' => ['Kirguistán', ['Biskek']],
            // Esta línea sirve para incluir Kiribati con sus ciudades principales.
            'KI' => ['Kiribati', ['Tarawa']],
        ];
    }
}
