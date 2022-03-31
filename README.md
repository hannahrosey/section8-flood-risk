# Mapping Flood Risk and where Housing Choice Voucher Holders Live

# About the project
This map shows where NYC households using Housing Choice Vouchers live, and compares that map to the 100- and 500-year floodplain for the 2020s based on estimates of sea level rise. It uses Public Use Microdata Areas (PUMAS), which is a census estimate of neighborhood geographies. 

<img width="1280" alt="Picture of a map" src="https://user-images.githubusercontent.com/13337090/161155092-07797675-482f-44bc-8030-1507e630a6dd.png">

# About the class
This project was created as a final project for NYU Wagner's URPL-GP 4650 Advanced GIS: Interactive Web Mapping and Spatial Data Visualization

# Code
* css: stylesheet for webiste
* js: javascript file to populate the map using mapboxgl
* index.html: website page
* data_cleaning: files for developing this dataset. See "Data sources" in the Methodology section for more info
	* data_cleaning.ipynb: main file for cleaning data in Python
	* floodplain_cleaning.qgz: main project for cleaning data in QGIS
	* hcv_floodplain_500_intersection.geosjon: intersection of 500-year floodplain and HCVP dataset
	* hcv_floodplain_100_intersection.geosjon: intersection of 100-year floodplain and HCVP dataset
	* nyct2020_22a: shapefiles for NYC 2010 census
	* floodplain_100.geojson: 100-year floodplain
	* floodplain_500.geojson: 500-year floodplain
	* puma_cd_map: map of 2010 census PUMAS in NYC
	* nyc2010census_tabulation_equiv.xlsx, 2010_Census_Tract_to_2010_PUMA.csv: PUMA to census tract equivalency tables
	* TRACT_MO_WY_2021.xlsx: 2021 HUD Picture of Subsidized Housing dataset

# Methodology
**Estimated % of voucher households in a floodplain:** This is the total number of voucher holders by census tract, joined to 100- and 500-year floodplains at the census tract level. Next, the sum of voucher households in the flood plain is divided by the sum of total voucher households in the PUMA to get a PUMA-level share
**Reported households and individuals:** This is the sum of total reported households and individuals for census tracts in each PUMA. *Reported* households are those that filled out the certification paperwork in the time period when this report was prepared, and underestimates the total number of households. Data are also omitted by HUD in census tracts with fewer than 11 voucher households due to privacy concerns.
**Avg. household size:** This is the sum of total reported individuals in a PUMA, divided by the sum of total reported households in a PUMA.
**Estimated households and individuals:** Estimated households is the total HCVP *units* in a census tract multiplied by the *percent occupied* figure provided by HUD to get an estimate of the number of households. This is summed at the PUMA level. Then, it is multiplied by the average household size at the PUMA level to get an estimate of individuals.

## Data sources
*HUD?s 2021 <a href=?https://www.huduser.gov/portal/datasets/assthsg.html#2009-2021_data?>Picture of Subsidized Housing report</a>
*NYC Department of City Planning <a href=?https://www1.nyc.gov/site/planning/data-maps/open-data/census-download-metadata.page?>2010 Census Tract Shape Files</a>
*NYC Mayor's Office of Climate and Sustainability?s Sea Level Rise Maps for the 2020s, including <a href=?https://data.cityofnewyork.us/Environment/Sea-Level-Rise-Maps-2020s-100-year-Floodplain-/ezfn-5dsb?>100-year</a> and <a href=?https://data.cityofnewyork.us/Environment/Sea-Level-Rise-Maps-2020s-500-year-Floodplain-/ajyu-7sgg?>500-year</a> floodplains. Many thanks to <a href=?https://github.com/joannlee-nyc?>Joann Lee</a> for advice on cleaning these files
*The US Cenus?s <a href=?https://www2.census.gov/geo/docs/maps-data/data/rel/2010_Census_Tract_to_2010_PUMA.txt?>crosswalk</a> of Census Tracts to PUMAs
*NYC Department of City Planning Population Division?s <a href=?https://www1.nyc.gov/assets/planning/download/pdf/data-maps/nyc-population/census2010/puma_cd_map.pdf?>map</a> of PUMA names and Community District mappings
            </ul>

# Background
## What is HCVP?
The Section 8 Housing Choice Voucher Program is a key support for low-income renters. According to the <a href=?https://nlihc.org/sites/default/files/oor/2021/Out-of-Reach_2021.pdf?>National Low Income Housing Coalition</a>, a New York state renter making the minimum wage in 2021 needed to work 109 hours a week to afford a 2-bedroom home. The HCVP supports renters in this untenable situation by paying the portion of a participant?s rent above 30% of their income. In addition, many policymakers focused on how racial and economic segregation  see vouchers as a way to expand people?s choices about where they live. About 124,000 people use these vouchers in New York City, including 85,000 served by the <a href=?https://www1.nyc.gov/site/nycha/section-8/about-section-8.page#:~:text=Approximately%2085%2C000%20Section%208%20vouchers,programs%20in%20New%20York%20City?>New York City Housing Authority</a> and 39,000 served by the <a href=?https://www1.nyc.gov/site/hpd/services-and-information/about-section-8.page?>Department of Housing Preservation and Development</a>. </p>

## What do floodplains have to do with it?
Climate change is leading to more frequent and severe storm events, which sea level rise will exacerbate. Storm events not only cause immediate threats to people?s safety, like floods, but also cause problems that can effect people over the long-term: damage to vital transportation systems, health effects from exposure to mold or chronic stress, and displacement, to name a few. Low-income renters are most vulnerable to these problems. Voucher households can protect themselves by choosing low-risk neighborhoods, and policymakers can help by allocating funding for counselors who assist voucherholders in finding the best home for them. That definition should include free of flood risk.
