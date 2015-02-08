var census_1801 = "http://digitalarkivet.arkivverket.no/en-gb/ft/sok/1801";
var census_1865 = "http://digitalarkivet.arkivverket.no/en-gb/ft/sok/1865";
var census_1875 = "http://digitalarkivet.arkivverket.no/en-gb/ft/sok/1875";
var census_1885 = "http://digitalarkivet.arkivverket.no/en-gb/ft/sok/1885";
var census_1900 = "http://digitalarkivet.arkivverket.no/en-gb/ft/sok/1900";
var census_1910 = "http://digitalarkivet.arkivverket.no/en-gb/ft/sok/1910";

//Family Search indexed records results
var Akershus_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3ANorway%2CAkershus";
var Akershus_searchResults = "2,131,267";
var Aust_Agder_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CAust-Agder%22";
var Aust_Agder_searchResults = "1,801,112";
var Buskerud_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CBuskerud%22";
var Buskerud_searchResults = "2,477,648";
var Finnmark_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CFinnmark%22";
var Finnmark_searchResults = "186,109";
var Hedmark_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CHedmark%22";
var Hedmark_searchResults = "1,768,453";
var Bergen_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CBergen%22";
var Bergen_searchResults = "469,838";
var Hordaland_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CHordaland%22";
var Hordaland_searchResults = "2,395,135";
var More_og_Romsdal_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CM%C3%B8re%20og%20Romsdal%22";
var More_og_Romsdal_searchResults = "1,351,868";
var Nord_Trondelag_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CNord-Tr%C3%B8ndelag%22";
var Nord_Trondelag_searchResults = "1,061,910";
var Nordland_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CNordland%22";
var Nordland_searchResults = "1,324,193";
var Oppland_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2COppland%22";
var Oppland_searchResults = "1,903,677";
var Oslo_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2COslo%22";
var Oslo_searchResults = "1,039,992";
var Ostfold_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2C%C3%98stfold%22";
var Ostfold_searchResults = "1,676,823";
var Rogaland_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CRogaland%22";
var Rogaland_searchResults = "1,315,022";
var Sogn_og_Fjordane_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CSogn%20og%20Fjordane%22";
var Sogn_og_Fjordane_searchResults = "1,284,584";
var Sor_Trondelag_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CS%C3%B8r-Tr%C3%B8ndelag%22";
var Sor_Trondelag_searchResults = "1,429,091";
var Telemark_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CTelemark%22";
var Telemark_searchResults = "1,429,960";
var Troms_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CTroms%22";
var Troms_searchResults = "672,682";
var Vest_Agder_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CVest-Agder%22";
var Vest_Agder_searchResults = "1,687,529";
var Vestfold_FSindex = "https://familysearch.org/search/record/results?count=20&query=%2Brecord_country%3ANorway%20%2Brecord_subcountry%3A%22Norway%2CVestfold%22";
var Vestfold_searchResults = "1,713,739";

function getFSinfo(county)
{
	var FSresults = [];
	var FSlink, numRecords;
	
	switch(county){
		case "Akershus":
			FSlink = Akershus_FSindex;
			numRecords = Akershus_searchResults;
			break;
		case "Aust-Agder":
			FSlink = Aust_Agder_FSindex;
			numRecords = Aust_Agder_searchResults;
			break;
		case "Buskerud":
			FSlink = Buskerud_FSindex;
			numRecords = Buskerud_searchResults;
			break;
		case "Finnmark":
			FSlink = Finnmark_FSindex;
			numRecords = Finnmark_searchResults;
			break;
		case "Hedmark":
			FSlink = Hedmark_FSindex;
			numRecords = Hedmark_searchResults;
			break;
		case "Hordaland":
			FSlink = Hordaland_FSindex;
			numRecords = Hordaland_searchResults;
			break;
		case "Møre og Romsdal":
			FSlink = More_og_Romsdal_FSindex;
			numRecords = More_og_Romsdal_searchResults;
			break;
		case "Nord-Trøndelag":
			FSlink = Nord_Trondelag_FSindex;
			numRecords = Nord_Trondelag_searchResults;
			break;
		case "Nordland":
			FSlink = Nordland_FSindex;
			numRecords = Nordland_searchResults;
			break;
		case "Oppland":
			FSlink = Oppland_FSindex;
			numRecords = Oppland_searchResults;
			break;
		case "Rogaland":
			FSlink = Rogaland_FSindex;
			numRecords = Rogaland_searchResults;
			break;
		case "Sogn og Fjordane":
			FSlink = Sogn_og_Fjordane_FSindex;
			numRecords = Sogn_og_Fjordane_searchResults;
			break;
		case "Sør-Trøndelag":
			FSlink = Sor_Trondelag_FSindex;
			numRecords = Sor_Trondelag_searchResults;
			break;
		case "Telemark":
			FSlink = Telemark_FSindex;
			numRecords = Telemark_searchResults;
			break;
		case "Troms":
			FSlink = Troms_FSindex;
			numRecords = Troms_searchResults;
			break;
		case "Vest-Agder":
			FSlink = Vest_Agder_FSindex;
			numRecords = Vest_Agder_searchResults;
			break;
		case "Vestfold":
			FSlink = Vestfold_FSindex;
			numRecords = Vestfold_searchResults;
			break;
		case "Østfold":
			FSlink = Ostfold_FSindex;
			numRecords = Ostfold_searchResults;
			break;			
	}
	
	FSresults = [FSlink, numRecords];
	return FSresults;
}
