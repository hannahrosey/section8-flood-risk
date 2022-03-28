# Source and Documentation: https://github.com/vr00n/NYC-LocalGeo-CrossWalk
## Data Source Definition Crosswalk of all NYC geographies for mapping census tract to community district. Note: last update was 2017, suggesting these are 2010 census definitions--however, this might need to be updated in the future.

# Read census tract to CD mapping table
xwalk = pd.read_csv("
                    https://github.com/vr00n/NYC-LocalGeo-CrossWalk/raw/master/MASTER-CROSSWALK-NAD83.csv")

# Combine and aggregate hcv data at community district level
hcv_cd = hcv.merge(xwalk,how="left",left_on="census_tract", right_on="CT2010")
hcv_cd_g = hcv_cd.groupby(["program_label","BoroName","BoroCD","NTAName"]).aggregate({
    "number_reported":"sum",
    "people_total":"sum"}).\
    sort_values("number_reported",ascending=False).\
    reset_index()

hcv_cd_g["avg_hh_size"] = hcv_cd_g.apply(lambda x: round(x["people_total"]/x["number_reported"],1) if x["number_reported"] >0 else None, axis=1)

hcv_cd_g.to_csv("grouped_hcv_data.csv")

# Get records that are in HCV dataset and match to multiple CDs in xwalk
check = xwalk.groupby(["BoroCode","CT2010"]).\
    aggregate({"BoroCD":"nunique"})


check.loc[check.BoroCD>1].\
    reset_index().merge(
        hcv[["census_tract","borocode"]],
        how="inner",
        left_on=["BoroCode","CT2010"],
        right_on=["borocode","census_tract"]).\
    drop_duplicates()

# Example problem record
xwalk.loc[xwalk.CT2010==38302,["BoroCode","CT2010","BoroCD"]].drop_duplicates().sort_values("BoroCode")
hcv.loc[hcv.census_tract==38302]

#Source and documentation: https://www1.nyc.gov/site/planning/data-maps/open-data/census-download-metadata.page

#Source and Documentation: https://data.cityofnewyork.us/City-Government/Community-Districts/yfnk-k7r4

#Data Source Definition: NYC Open Data Portal GeoJSON file for community districts, including boroughCD id for mapping to crosswalk
# Read in and inspect data
cd_json = gpd.read_file("https://data.cityofnewyork.us/api/geospatial/yfnk-k7r4?method=export&format=GeoJSON")
cd_json.head()
