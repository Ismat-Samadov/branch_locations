# Bank Branch Network Analysis - Calculation Methodology

**Project:** Azerbaijan Bank Branch Analysis
**Focus:** Strategic Insights for Bank of Baku
**Data Source:** `data/combined_atms.csv`
**Total Records:** 585 bank branches across 20 banks
**Generated:** December 2025 (Updated)

---

## Data Source

### Input Data
- **File:** `data/combined_atms.csv`
- **Fields:**
  - `bank_name`: Name of the bank
  - `lat`: Latitude coordinate (decimal degrees)
  - `long`: Longitude coordinate (decimal degrees)

### Data Preparation
```python
# Load and clean data
df = pd.read_csv('data/combined_atms.csv')
df['lat'] = pd.to_numeric(df['lat'], errors='coerce')
df['long'] = pd.to_numeric(df['long'], errors='coerce')
df = df.dropna(subset=['lat', 'long'])

# Key variables
total_count = len(df)  # 585 total branches
bob_count = df[df['bank_name'] == 'Bank of Baku'].shape[0]  # 21 branches
```

---

## Banks Included in Analysis

### Complete Bank List (20 Banks)

**Major Banks:**
1. Kapital Bank - 177 branches (market leader, 30.3%)
2. ABB Bank - 78 branches (13.3%)
3. Bank Respublika - 40 branches (6.8%)
4. Unibank - 36 branches (6.2%)
5. AccessBank - 35 branches (6.0%)

**Mid-Tier Banks:**
6. Rabita Bank - 31 branches
7. Xalq Bank - 31 branches
8. Yelo Bank - 22 branches
9. **Bank of Baku - 21 branches** (Focus of this analysis)
10. Turan Bank - 19 branches

**Smaller Banks:**
11. AzerTurk Bank - 17 branches
12. Express Bank - 16 branches
13. Ziraat Bank - 10 branches
14. Premium Bank - 8 branches
15. Yapi Kredi Bank - 8 branches
16. Pasha Bank - 8 branches
17. BTB (Baku Business Bank) - 8 branches
18. ASB Bank - 7 branches
19. AFB (Azərbaycan Fəhlə Bankı) - 7 branches
20. VTB Bank - 6 branches

**Data Update History:**
- Original dataset: 11 banks, 456 branches
- Updated dataset: 20 banks, 585 branches (+129 branches, +9 banks)
- All coordinate data verified and geocoded where necessary

---

## Chart 1: Branch Count Comparison

### Purpose
Compare total branch counts across all banks, highlighting Bank of Baku's position.

### Calculation Method
```python
# Count branches per bank
branch_counts = df['bank_name'].value_counts().sort_values(ascending=True)

# Calculate market rank
bob_rank = (df['bank_name'].value_counts() > bob_count).sum() + 1

# Market share
bob_market_share = (bob_count / total_count) * 100
```

### Key Metrics
- **Branch Count:** Simple count aggregation by bank
- **Market Rank:** Number of banks with more branches + 1
- **Market Share:** `(Bank Branches / Total Branches) × 100`

### Output
- Horizontal bar chart sorted by branch count
- Bank of Baku highlighted in red (#e74c3c)
- Value labels on each bar

**Result:**
- Bank of Baku: 21 branches
- Market Rank: #9 out of 20 banks
- Market Share: 3.6%

---

## Chart 2: Market Share Analysis

### Purpose
Three-panel visualization showing complete market rankings, distribution, and competitive position.

### Panel 1: Complete Market Rankings

**Calculation:**
```python
market_share = df['bank_name'].value_counts()

for bank, count in market_share.items():
    percentage = (count / total_count) * 100
    label = f"{count} ({percentage:.1f}%)"
```

**Metrics:**
- Absolute count per bank
- Percentage of total market: `(Bank Count / Total Count) × 100`

### Panel 2: Market Share Distribution

**Calculation:**
```python
market_pct = (market_share / total_count * 100).sort_values(ascending=False)

# Stacked bar showing cumulative 100%
cumulative = 0
for bank in market_pct.index:
    width = market_pct[bank]
    position = cumulative
    cumulative += width  # Next segment starts here
```

**Metrics:**
- Each segment width = bank's market share percentage
- Total segments = 100%

### Panel 3: Bank of Baku vs Top 5 Competitors

**Calculation:**
```python
top_competitors = market_share[market_share.index != 'Bank of Baku'].head(5)
bob_value = market_share['Bank of Baku']

# Gap calculation
gap_to_leader = top_competitors.iloc[0] - bob_value  # 156 branches (Kapital Bank: 177 vs BoB: 21)
```

**Metrics:**
- Direct comparison of absolute counts
- Gap annotation showing difference to nearest larger competitor

---

## Chart 3: Geographic Distribution - All Banks

### Purpose
Plot all branch locations on a coordinate system, highlighting Bank of Baku.

### Calculation Method
```python
# No calculation - direct plotting
for bank in df['bank_name'].unique():
    bank_data = df[df['bank_name'] == bank]

    # Plot coordinates
    lat = bank_data['lat'].values
    long = bank_data['long'].values

    # Special styling for Bank of Baku
    if bank == 'Bank of Baku':
        marker = 's'  # square
        size = 150
        zorder = 5  # plot on top
    else:
        marker = 'o'  # circle
        size = 50
        zorder = 1
```

### Metrics
- **Geographic Spread (Bank of Baku):**
  - Latitude range: `max(lat) - min(lat)`
  - Longitude range: `max(long) - min(long)`

**Result:**
- Latitude range: Variable across Azerbaijan
- All 585 branches plotted
- Bank of Baku branches shown as red squares

---

## Chart 4: Bank of Baku vs Top Competitors - Geographic

### Purpose
Side-by-side geographic comparison of Bank of Baku with top 3 competitors.

### Calculation Method
```python
# Get top 3 competitors
top_3_competitors = df['bank_name'].value_counts().head(3).index.tolist()

# Create comparison set
comparison_banks = ['Bank of Baku'] + [b for b in top_3_competitors if b != 'Bank of Baku'][:3]

# For each bank, plot:
# 1. All other branches in gray (context)
# 2. This bank's branches highlighted
```

### Metrics
- No calculations, pure visualization
- 2×2 grid showing 4 banks
- Each subplot shows same geographic area for fair comparison

---

## Chart 5: Regional Clustering Analysis

### Purpose
Identify major market regions using density-based clustering algorithm.

### Calculation Method

**Algorithm:** DBSCAN (Density-Based Spatial Clustering)

```python
from sklearn.cluster import DBSCAN

coords = df[['lat', 'long']].values

# DBSCAN clustering
clustering = DBSCAN(eps=0.5, min_samples=5).fit(coords)
df['cluster'] = clustering.labels_

# Count clusters
num_clusters = df['cluster'].nunique() - 1  # -1 excludes outliers (label=-1)
```

**Parameters:**
- `eps=0.5`: Maximum distance between points to be in same cluster (~55km)
- `min_samples=5`: Minimum points required to form a cluster
- Outliers labeled as `-1`

**Bank of Baku Cluster Analysis:**
```python
# Count BoB presence per cluster
bob_clusters = df[df['bank_name'] == 'Bank of Baku']['cluster'].value_counts()
all_clusters = df['cluster'].value_counts()

# Calculate BoB share per cluster
cluster_df['BoB_Share'] = (cluster_df['Bank of Baku'] / cluster_df['Total Branches']) * 100
```

### Metrics
- **Clusters Identified:** 3 major regions + outliers
- **BoB Share per Cluster:** Percentage of branches in each cluster belonging to BoB
- **Underserved Clusters:** Clusters where BoB Share < 5%

**Result:**
- 3 major regional clusters identified
- Bank of Baku present in multiple clusters
- Several underserved clusters identified

---

## Chart 6: Baku City Analysis

### Purpose
Detailed analysis of the capital city market.

### Calculation Method

**Baku Boundary Definition:**
```python
# Approximate Baku city boundaries
baku_df = df[
    (df['lat'] >= 40.3) & (df['lat'] <= 40.5) &
    (df['long'] >= 49.7) & (df['long'] <= 50.0)
].copy()
```

**Geographic Bounds:**
- Latitude: 40.3° to 40.5°
- Longitude: 49.7° to 50.0°
- Approximate area: ~20km × ~20km

**Metrics:**
```python
total_baku = len(baku_df)  # Total branches in Baku
bob_baku = len(baku_df[baku_df['bank_name'] == 'Bank of Baku'])  # BoB branches

# Baku market share
baku_market_share = (bob_baku / total_baku) * 100

# Baku rank
baku_rank = (baku_df['bank_name'].value_counts() > bob_baku).sum() + 1
```

### Output Metrics
- Total Baku branches: ~250-300 (varies with dataset)
- Bank of Baku in Baku: 14 branches (confirmed)
- Baku market share: Calculated as (14 / total_baku) × 100
- Baku rank: Calculated based on branch counts
- Note: Exact totals recalculated with each analysis run

---

## Chart 7: Baku vs Regions Coverage

### Purpose
Compare branch distribution between capital and regional areas.

### Calculation Method

**Regional Classification:**
```python
df['region'] = df.apply(
    lambda row: 'Baku' if (40.3 <= row['lat'] <= 40.5 and 49.7 <= row['long'] <= 50.0)
    else 'Regions',
    axis=1
)
```

**Metrics Calculated:**

1. **Regional Distribution per Bank:**
```python
region_dist = df.groupby(['bank_name', 'region']).size().unstack(fill_value=0)
# Returns DataFrame with banks as rows, Baku/Regions as columns
```

2. **Regional Coverage Percentage:**
```python
region_pct = region_dist.div(region_dist.sum(axis=1), axis=0) * 100
regional_coverage = region_pct['Regions']  # % of branches outside Baku
```

3. **Bank of Baku Specifics:**
```python
bob_region = df[df['bank_name'] == 'Bank of Baku']['region'].value_counts()
# Baku: 14 branches (66.7%) - above industry average concentration
# Regions: 7 branches (33.3%) - below industry average (48.3%)
```

**Industry Average:**
```python
avg_regional_coverage = df.groupby('bank_name')['region'].apply(
    lambda x: (x == 'Regions').sum() / len(x) * 100
).mean()  # = 48.3% across all 20 banks
```

### Output Metrics
- BoB Baku concentration: 66.7% (14/21 branches)
- BoB Regional coverage: 33.3% (7/21 branches)
- Industry average regional: 48.3% (across 20 banks)
- Gap to average: -15.0 percentage points (below average)

---

## Chart 8: Competitive Density Analysis

### Purpose
Visualize branch concentration and identify areas of high competition.

### Calculation Method

**Kernel Density Estimation (KDE):**
```python
from scipy.stats import gaussian_kde

# All banks density
xy_all = np.vstack([df['long'], df['lat']])
z_all = gaussian_kde(xy_all)(xy_all)
# Returns density value for each point

# Competitor density (excluding Bank of Baku)
competitors_df = df[df['bank_name'] != 'Bank of Baku']
xy_comp = np.vstack([competitors_df['long'], competitors_df['lat']])
z_comp = gaussian_kde(xy_comp)(xy_comp)
```

**Density Score Interpretation:**
- Higher value = more branches nearby
- Uses Gaussian kernel to smooth density calculation
- Bandwidth automatically selected by Scott's Rule

### Metrics
- **Density Value:** Continuous value representing local branch concentration
- **High Density Areas:** Darker/warmer colors in heatmap
- **Low Density Areas:** Lighter/cooler colors

**Insight:**
Bank of Baku branches predominantly located in high-density areas (where competitors are also present).

---

## Chart 9: Gap Analysis - Underserved Areas

### Purpose
Identify competitor locations far from any Bank of Baku branch (expansion opportunities).

### Calculation Method

**Nearest Neighbor Distance:**
```python
from sklearn.neighbors import NearestNeighbors

bob_coords = df[df['bank_name'] == 'Bank of Baku'][['lat', 'long']].values
comp_coords = df[df['bank_name'] != 'Bank of Baku'][['lat', 'long']].values

# Find nearest BoB branch for each competitor location
nbrs = NearestNeighbors(n_neighbors=1).fit(bob_coords)
distances, indices = nbrs.kneighbors(comp_coords)

# Euclidean distance formula:
# distance = √((lat₂ - lat₁)² + (long₂ - long₁)²)
```

**Gap Identification:**
```python
gap_df['distance_to_bob'] = distances.flatten()

# Define significant gaps (>0.3° ≈ 30km)
gaps = gap_df[gap_df['distance_to_bob'] > 0.3].sort_values('distance_to_bob', ascending=False)
```

**Distance Conversion:**
- 1° latitude ≈ 111 km
- 1° longitude ≈ 111 km × cos(latitude)
- At Azerbaijan's latitude (~40°), approximately 85km per degree longitude

### Metrics
- **Gap Locations:** 198 competitor locations >30km from nearest BoB branch
- **Distance Threshold:** 0.3° (approximately 30km)
- **Top Opportunities:** Sorted by distance (furthest = highest priority)

**Formula:**
```
Distance (degrees) = √((lat_comp - lat_bob)² + (long_comp - long_bob)²)
Distance (km) ≈ Distance (degrees) × 111
```

---

## Chart 10: Nearest Competitor Analysis

### Purpose
Analyze which competitors are most frequently nearest to Bank of Baku branches.

### Calculation Method

**For Each BoB Branch:**
```python
bob_coords = df[df['bank_name'] == 'Bank of Baku'][['lat', 'long']].values
comp_coords = df[df['bank_name'] != 'Bank of Baku'][['lat', 'long']].values
comp_banks = df[df['bank_name'] != 'Bank of Baku']['bank_name'].values

# Find nearest competitor for each BoB branch
nbrs_comp = NearestNeighbors(n_neighbors=1).fit(comp_coords)
distances, indices = nbrs_comp.kneighbors(bob_coords)

# Map indices to bank names
nearest_competitor = [comp_banks[i] for i in indices.flatten()]
```

**Metrics Calculated:**

1. **Distance Distribution:**
```python
bob_analysis['dist_to_competitor'] = distances.flatten()

mean_distance = bob_analysis['dist_to_competitor'].mean()
median_distance = bob_analysis['dist_to_competitor'].median()
```

2. **Competitor Frequency:**
```python
nearest_comp_counts = bob_analysis['nearest_competitor'].value_counts()
# Shows which banks are most often the closest competitor
```

### Output Metrics
- **Mean Distance:** Average distance to nearest competitor
- **Median Distance:** Middle value of distance distribution
- **Most Frequent Competitors:** Banks that appear most as nearest neighbor

**Result:**
- Average: ~0.0159° (~1.8km)
- Most frequent: ABB Bank, Yelo Bank, Turan Bank

---

## Chart 11: Competitive Intensity Index

### Purpose
Measure how many competitors are within a defined radius of each branch.

### Calculation Method

**Intensity Calculation:**
```python
def calculate_competitive_intensity(bank_name, radius=0.1):
    """
    Calculate number of competitors within radius for each branch.

    radius=0.1 degrees ≈ 10km
    """
    bank_coords = df[df['bank_name'] == bank_name][['lat', 'long']].values
    all_coords = df[['lat', 'long']].values

    intensities = []
    for coord in bank_coords:
        # Calculate distances to all branches
        distances = np.sqrt(((all_coords - coord)**2).sum(axis=1))

        # Count branches within radius (excluding self)
        nearby = (distances > 0) & (distances < radius)
        intensity = nearby.sum()
        intensities.append(intensity)

    return intensities
```

**Formula:**
```
For each branch at (lat, long):
  Distance to branch i = √((lat_i - lat)² + (long_i - long)²)

  If 0 < Distance < 0.1°:
    Count as competitor within radius

Competitive Intensity = Total count of competitors within radius
```

**Metrics Calculated:**
```python
# For each bank
intensity_comparison = pd.DataFrame({
    'Bank': bank,
    'Avg_Competitors_Nearby': np.mean(intensities),
    'Max_Competitors_Nearby': np.max(intensities),
    'Min_Competitors_Nearby': np.min(intensities)
})
```

### Output Metrics
- **Radius:** 0.1° (approximately 10km)
- **BoB Average Intensity:** 108.3 competitors within 10km
- **Industry Comparison:** Compared to all other banks
- **Distribution:** Histogram showing intensity variation across BoB branches

**Interpretation:**
Higher intensity = more competitive location = harder to differentiate

---

## Chart 12: Regional Market Dominance Analysis

### Purpose
Analyze Bank of Baku's presence across Azerbaijan's meaningful geographic regions and identify zone leaders.

### Calculation Method

**Regional Zone Definition:**
```python
def assign_zone(row):
    """
    Classify branches into Azerbaijan's actual geographic zones.
    Based on administrative regions and major city boundaries.
    """
    lat, long = row['lat'], row['long']

    # Baku City (central capital)
    if 40.3 <= lat <= 40.5 and 49.7 <= long <= 50.0:
        return 'Baku City'

    # Absheron Peninsula (around Baku)
    elif 40.2 <= lat <= 40.6 and 49.5 <= long <= 50.3:
        return 'Absheron'

    # North Zone (Guba, Gusar, Khachmaz)
    elif lat > 41.0:
        return 'North'

    # Northwest Zone (Ganja, Shaki, Zagatala)
    elif lat > 40.5 and long < 48.5:
        return 'Northwest'

    # Central Zone (Mingachevir, Yevlakh, Agdash)
    elif 40.0 <= lat <= 40.8 and 47.0 <= long < 49.5:
        return 'Central'

    # South Zone (Lankaran, Astara, Lerik)
    elif lat < 39.0:
        return 'South'

    # West Zone (Gazakh, Tovuz)
    elif long < 46.0:
        return 'West'

    else:
        return 'Other'

df['zone'] = df.apply(assign_zone, axis=1)
```

**Zone Boundaries:**
- **Baku City:** 40.3-40.5°N, 49.7-50.0°E (capital city)
- **Absheron:** 40.2-40.6°N, 49.5-50.3°E (peninsula)
- **North:** Lat >41.0°N (mountain regions)
- **Northwest:** Lat >40.5°N, Long <48.5°E (Ganja region)
- **Central:** 40.0-40.8°N, 47.0-49.5°E (Mingachevir region)
- **South:** Lat <39.0°N (Caspian coast)
- **West:** Long <46.0°E (border region)

**Metrics per Zone:**
```python
for zone in zones:
    zone_df = df[df['zone'] == zone]

    # Zone leader
    leader = zone_df['bank_name'].value_counts().index[0]
    leader_count = zone_df['bank_name'].value_counts().values[0]

    # Bank of Baku metrics
    bob_count_zone = len(zone_df[zone_df['bank_name'] == 'Bank of Baku'])
    bob_share = (bob_count_zone / len(zone_df)) * 100 if len(zone_df) > 0 else 0
    bob_rank = (zone_df['bank_name'].value_counts() > bob_count_zone).sum() + 1
```

### Output Metrics
- **Zone Leader:** Dominant bank in each region
- **BoB Presence:** Branch count per zone
- **BoB Market Share:** Percentage per zone
- **BoB Rank:** Position within each zone

**Results Summary:**
- **Baku City:** BoB has 14 branches (5.5% share, Rank #5)
- **Absheron:** BoB has 2 branches (4.8% share, Rank #4)
- **North:** BoB has 2 branches (2.8% share, Rank #9)
- **Northwest:** BoB has 1 branch (1.1% share, Rank #13)
- **Central:** BoB has NO presence (Leader: Kapital Bank with 12 branches)
- **South:** BoB has 1 branch (5.3% share, Rank #3)
- **West:** BoB has NO presence (Leader: Kapital Bank with 10 branches)

### Strategic Insight
Two regions with **zero Bank of Baku presence** (Central and West) represent high-priority expansion targets. Kapital Bank dominates both zones.

---

## Chart 13a: Growth Opportunity Score - Baku-Absheron

### Purpose
Create a focused heatmap scoring urban expansion opportunities in the Baku-Absheron region.

### Geographic Boundaries
```python
baku_lat_min, baku_lat_max = 40.30, 40.65
baku_long_min, baku_long_max = 49.60, 50.20
```

### Calculation Method

**Grid Generation (Urban-focused):**
```python
grid_resolution_baku = 35  # 35×35 = 1225 points for higher resolution

lat_grid_baku = np.linspace(baku_lat_min, baku_lat_max, grid_resolution_baku)
long_grid_baku = np.linspace(baku_long_min, baku_long_max, grid_resolution_baku)

grid_points_baku = [[lat, long] for lat in lat_grid_baku for long in long_grid_baku]
```

**Opportunity Score Formula (Urban-Optimized):**
```python
def calculate_opportunity_score_baku(point):
    # Factor 1: Distance to nearest BoB branch (higher = better)
    distances_bob = np.sqrt(((bob_coords_baku - point)**2).sum(axis=1))
    dist_score = distances_bob.min()

    # Factor 2: Number of competitors nearby (5km radius for urban density)
    distances_comp = np.sqrt(((comp_coords_baku - point)**2).sum(axis=1))
    nearby_comps = (distances_comp < 0.05).sum()  # Within ~5km

    # Combined score (higher weight on distance for urban areas)
    opportunity_score = dist_score * 15 + nearby_comps * 0.8

    return opportunity_score
```

### City Labels Included
- Baku Center, Sumqayit, Khirdalan, Binəqədi, Sabunçu, Suraxanı
- Nəsimi, Yasamal, Xətai, Qaradağ, Pirallahı, Mərdəkan

### Output Metrics
- **Grid Points:** 1,225 locations evaluated
- **Top 15 Opportunities:** Highest scoring coordinates
- **Current Status:** 292 total branches, 16 BoB branches (5.5%)

---

## Chart 13b: Growth Opportunity Score - Regions

### Purpose
Create a heatmap scoring regional expansion opportunities outside Baku-Absheron.

### Geographic Boundaries
All of Azerbaijan EXCEPT the Baku-Absheron rectangle defined above.

### Calculation Method

**Grid Generation (Regional):**
```python
grid_resolution_regions = 30  # 30×30 = 900 points

# Dynamic bounds based on regional data
region_lat_min, region_lat_max = df_regions['lat'].min() - 0.1, df_regions['lat'].max() + 0.1
region_long_min, region_long_max = df_regions['long'].min() - 0.1, df_regions['long'].max() + 0.1

grid_points_regions = [[lat, long] for lat in lat_grid_regions for long in long_grid_regions]
```

**Opportunity Score Formula (Regional-Optimized):**
```python
def calculate_opportunity_score_regions(point):
    # Skip points within Baku-Absheron
    if (baku_lat_min <= point[0] <= baku_lat_max and
        baku_long_min <= point[1] <= baku_long_max):
        return 0

    # Factor 1: Distance to nearest BoB branch (higher = better)
    distances_bob = np.sqrt(((bob_coords_regions - point)**2).sum(axis=1))
    dist_score = distances_bob.min()

    # Factor 2: Number of competitors nearby (30km radius for rural areas)
    distances_comp = np.sqrt(((comp_coords_regions - point)**2).sum(axis=1))
    nearby_comps = (distances_comp < 0.3).sum()  # Within ~30km

    # Combined score
    opportunity_score = dist_score * 10 + nearby_comps * 0.5

    return opportunity_score
```

### City Labels Included (Major Cities)
- Gəncə, Mingəçevir, Lənkəran, Şəki, Şirvan, Xaçmaz, Quba
- Naxçıvan, Zaqatala, Bərdə, Yevlax, Şamaxı, Masallı, Tovuz, Qazax, Şuşa

### Output Metrics
- **Grid Points:** 900 locations evaluated
- **Top 15 Opportunities:** Highest scoring coordinates
- **Current Status:** 293 total branches, 5 BoB branches (1.7%)

### Key Difference from Chart 13a
- Larger competitor search radius (30km vs 5km)
- Lower resolution grid (appropriate for regional analysis)
- Focus on identifying underserved regional markets

**Interpretation for Both Charts:**
Warmer colors (red/orange) = better expansion opportunities
Blue markers = major city reference points

---

## Chart 14: Multi-Metric Comparison

### Purpose
Compare Bank of Baku against top competitors across multiple dimensions.

### Metrics Calculated

**1. Branch Count:**
```python
branch_count = len(df[df['bank_name'] == bank])
```

**2. Geographic Spread:**
```python
bank_data = df[df['bank_name'] == bank]
lat_range = bank_data['lat'].max() - bank_data['lat'].min()
long_range = bank_data['long'].max() - bank_data['long'].min()
geo_spread = lat_range + long_range
```

**3. Baku Percentage:**
```python
baku_pct = (bank_data['region'] == 'Baku').sum() / len(bank_data) * 100
```

**4. Average Competitive Intensity:**
```python
avg_intensity = np.mean(intensity_data[bank])
# From Chart 11 calculations
```

**Normalization for Radar Chart:**
```python
# Normalize each metric to 0-100 scale
for col in metrics:
    max_val = metrics_df[col].max()
    metrics_normalized[col] = (metrics_df[col] / max_val) * 100
```

### Output Metrics
All metrics normalized to 0-100 for fair comparison in radar chart:
- **Branch Count:** Normalized count
- **Geographic Spread:** Normalized total range
- **Baku Focus:** Percentage (already 0-100)
- **Competitive Intensity:** Normalized average

---

## Chart 15: Executive Summary Dashboard

### Purpose
Six-panel visual dashboard summarizing key strategic metrics.

### Panel Calculations

**1. Market Position Rankings:**
- Same as Chart 1
- Top 8 banks shown with rankings

**2. Key Metrics vs Industry Average:**
```python
metrics = {
    'Branches': bob_count,
    'Market Share %': (bob_count / total_count) * 100,
    'Regional Coverage %': (bob_region['Regions'] / bob_count) * 100
}

industry_avg = {
    'Branches': df.groupby('bank_name').size().mean(),  # 585/20 = 29.25 avg
    'Market Share %': 100 / df['bank_name'].nunique(),  # 100/20 = 5.0% avg
    'Regional Coverage %': df.groupby('bank_name')['region'].apply(
        lambda x: (x == 'Regions').sum() / len(x) * 100
    ).mean()  # 48.3% industry avg
}
```

**3. Expansion Opportunities:**
```python
opportunities = {
    'High Gap Areas': len(gaps),  # 198 locations from Chart 9
    'Underserved Clusters': (cluster_df['BoB_Share'] < 5).sum(),  # From Chart 5
    'Regional Gap': max_regional_branches - bob_regional_branches,
    'Branches Needed for 10% Share': int(total_count * 0.10) - bob_count  # 37 branches
}
```

**4. Geographic Distribution (Baku vs Regions):**
```python
# Pie chart percentages
baku_pct = (bob_region['Baku'] / bob_count) * 100
regions_pct = (bob_region['Regions'] / bob_count) * 100
```

**5. Direct Competitors:**
- Same as Chart 10
- Top 5 most frequent nearest competitors

**6. Competitive Intensity Distribution:**
- Same as Chart 11
- Histogram of intensity values

---

## Statistical Methods Summary

### 1. Clustering Algorithm: DBSCAN
- **Purpose:** Identify regional market clusters
- **Parameters:** eps=0.5°, min_samples=5
- **Output:** Cluster labels for each branch

### 2. Nearest Neighbor Search
- **Algorithm:** K-Nearest Neighbors (k=1)
- **Purpose:** Find closest competitor/gap analysis
- **Distance Metric:** Euclidean distance

### 3. Kernel Density Estimation
- **Method:** Gaussian KDE
- **Purpose:** Smooth density visualization
- **Bandwidth:** Scott's Rule (automatic)

### 4. Distance Calculations
- **Formula:** Euclidean distance in 2D
- **Unit:** Decimal degrees
- **Conversion:** ~111 km per degree latitude
- **Conversion:** ~85 km per degree longitude (at 40° latitude)

---

## Key Assumptions

1. **Baku City Boundaries:**
   - Approximate rectangular bounds
   - Lat: 40.3° to 40.5°
   - Long: 49.7° to 50.0°

2. **Distance Thresholds:**
   - Competitive radius: 0.1° (~10km)
   - Gap threshold: 0.3° (~30km)
   - Opportunity radius: 0.2° (~20km)

3. **Geographic Simplifications:**
   - Flat earth approximation (acceptable for small areas)
   - Euclidean distance (not great circle distance)
   - Uniform degree-to-km conversion

4. **Market Definition:**
   - Only branches counted (ATMs excluded)
   - All branches weighted equally
   - No consideration of branch size/capacity

---

## Data Quality Notes

1. **Coordinate Accuracy:**
   - Coordinates from multiple scrapers
   - Potential ±0.001° accuracy (~100m)
   - Sufficient for regional analysis

2. **Completeness:**
   - 585 branches total (20 banks)
   - All branches have valid coordinates
   - No missing data after cleaning

3. **Temporal:**
   - Snapshot data (December 2025)
   - Does not account for planned openings/closures

---

## Formula Reference

### Market Share
```
Market Share (%) = (Bank Branches / Total Branches) × 100
```

### Market Rank
```
Rank = COUNT(Banks with More Branches) + 1
```

### Euclidean Distance
```
Distance = √((lat₂ - lat₁)² + (long₂ - long₁)²)
```

### Regional Coverage
```
Regional Coverage (%) = (Regional Branches / Total Bank Branches) × 100
```

### Competitive Intensity
```
Intensity = COUNT(Branches where 0 < Distance < Radius)
```

### Opportunity Score
```
Score = (Distance to Nearest BoB) × 10 + (Nearby Competitors) × 0.5
```

### Cluster Share
```
BoB Cluster Share (%) = (BoB Branches in Cluster / Total Branches in Cluster) × 100
```

---

## Software & Libraries Used

- **Python:** 3.8+
- **pandas:** Data manipulation
- **numpy:** Numerical calculations
- **matplotlib:** Visualization
- **seaborn:** Statistical visualization
- **scikit-learn:** Machine learning algorithms (DBSCAN, KNN)
- **scipy:** Statistical functions (KDE)

---

## Reproducibility

All calculations can be reproduced by running:
```bash
python3 scripts/run_analysis.py
```

This will regenerate all 15 charts with identical methodology.

---

**Document Version:** 2.0 (Updated for 20-bank dataset)
**Last Updated:** December 2025
**Author:** Bank Branch Network Analysis System
**Major Changes:** Expanded from 11 to 20 banks (456→585 branches)
**Contact:** See STRATEGIC_INSIGHTS.txt for recommendations
