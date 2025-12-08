#!/usr/bin/env python3
"""
Bank Branch Network Analysis Script
Generates all charts and analysis for Bank of Baku
"""

import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.spatial import distance_matrix
from sklearn.cluster import KMeans, DBSCAN
from sklearn.neighbors import NearestNeighbors
from scipy.stats import gaussian_kde
import warnings
warnings.filterwarnings('ignore')

# Set style
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

# Set figure defaults
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['font.size'] = 10

print("=" * 80)
print("BANK BRANCH NETWORK ANALYSIS")
print("Focus: Strategic Insights for Bank of Baku")
print("=" * 80)
print()

# Load data
print("Loading data...")
df = pd.read_csv('data/combined_atms.csv')

# Convert coordinates to numeric
df['lat'] = pd.to_numeric(df['lat'], errors='coerce')
df['long'] = pd.to_numeric(df['long'], errors='coerce')

# Remove any rows with invalid coordinates
df = df.dropna(subset=['lat', 'long'])

print(f"Total branches loaded: {len(df)}")
print(f"Banks in dataset: {df['bank_name'].nunique()}")
print()

# ============================================================================
# Chart 1: Branch count by bank
# ============================================================================
print("Generating Chart 1: Branch Count Comparison...")
fig, ax = plt.subplots(figsize=(14, 7))

branch_counts = df['bank_name'].value_counts().sort_values(ascending=True)
colors = ['#e74c3c' if bank == 'Bank of Baku' else '#3498db' for bank in branch_counts.index]

branch_counts.plot(kind='barh', ax=ax, color=colors)
ax.set_xlabel('Number of Branches', fontsize=12, fontweight='bold')
ax.set_ylabel('Bank Name', fontsize=12, fontweight='bold')
ax.set_title('Branch Network Size Comparison - Bank of Baku vs Competitors',
             fontsize=14, fontweight='bold', pad=20)

# Add value labels
for i, v in enumerate(branch_counts.values):
    ax.text(v + 2, i, str(v), va='center', fontweight='bold')

plt.tight_layout()
plt.savefig('charts/01_branch_count_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

# Key insight
bob_count = df[df['bank_name'] == 'Bank of Baku'].shape[0]
total_count = len(df)
bob_rank = (df['bank_name'].value_counts() > bob_count).sum() + 1

print(f"✓ Chart 1 saved")
print(f"  Bank of Baku: {bob_count} branches, Rank #{bob_rank}, Market share: {bob_count/total_count*100:.1f}%")
print()

# ============================================================================
# Chart 2: Market share analysis - Clear bar chart visualization
# ============================================================================
print("Generating Chart 2: Market Share Analysis...")
fig = plt.figure(figsize=(18, 10))
gs = fig.add_gridspec(2, 2, hspace=0.35, wspace=0.3)

market_share = df['bank_name'].value_counts()

# 1. Complete market ranking - horizontal bar chart (top left, spans 2 rows)
ax1 = plt.subplot(gs[:, 0])
colors_rank = ['#e74c3c' if bank == 'Bank of Baku' else '#3498db' for bank in market_share.index]
y_pos = range(len(market_share))

bars = ax1.barh(y_pos, market_share.values, color=colors_rank, edgecolor='black', linewidth=1.2, alpha=0.85)
ax1.set_yticks(y_pos)
ax1.set_yticklabels(market_share.index, fontsize=11, fontweight='bold')
ax1.set_xlabel('Number of Branches', fontsize=12, fontweight='bold')
ax1.set_title('Complete Market Rankings - All Banks', fontsize=14, fontweight='bold', pad=15)
ax1.invert_yaxis()

# Add value and percentage labels
for i, (bar, bank) in enumerate(zip(bars, market_share.index)):
    width = bar.get_width()
    pct = width / total_count * 100
    label = f'{int(width)} ({pct:.1f}%)'
    ax1.text(width + 3, bar.get_y() + bar.get_height()/2, label,
            ha='left', va='center', fontweight='bold', fontsize=10,
            color='#e74c3c' if bank == 'Bank of Baku' else '#2c3e50')

ax1.grid(True, alpha=0.3, axis='x')
ax1.set_xlim(0, market_share.max() * 1.15)

# 2. Market share percentage - horizontal stacked bar (top right)
ax2 = plt.subplot(gs[0, 1])
market_pct = (market_share / total_count * 100).sort_values(ascending=False)

# Create stacked bar
left = 0
colors_stack = []
labels_stack = []
for bank in market_pct.index:
    if bank == 'Bank of Baku':
        color = '#e74c3c'
    elif market_pct[bank] >= 5:
        color = '#3498db'
    else:
        color = '#95a5a6'

    colors_stack.append(color)

    width = market_pct[bank]
    ax2.barh(0, width, left=left, color=color, edgecolor='white', linewidth=2, height=0.6)

    # Add label if segment is large enough
    if width >= 3:
        ax2.text(left + width/2, 0, f'{bank}\n{width:.1f}%',
                ha='center', va='center', fontsize=9, fontweight='bold', color='white')

    left += width

ax2.set_xlim(0, 100)
ax2.set_ylim(-0.5, 0.5)
ax2.set_xlabel('Market Share (%)', fontsize=12, fontweight='bold')
ax2.set_title('Market Share Distribution', fontsize=14, fontweight='bold', pad=15)
ax2.set_yticks([])
ax2.grid(True, alpha=0.3, axis='x')

# 3. Bank of Baku vs Top 5 Competitors (bottom right)
ax3 = plt.subplot(gs[1, 1])

# Get top 5 competitors (excluding Bank of Baku if it's in top 5, then add it)
top_competitors = market_share[market_share.index != 'Bank of Baku'].head(5)
bob_value = market_share['Bank of Baku']

# Create comparison data
comparison_banks = ['Bank of Baku'] + list(top_competitors.index[:5])
comparison_values = [bob_value] + list(top_competitors.values[:5])
comparison_pct = [v/total_count*100 for v in comparison_values]

colors_comp = ['#e74c3c'] + ['#95a5a6'] * 5
y_pos_comp = range(len(comparison_banks))

bars = ax3.barh(y_pos_comp, comparison_values, color=colors_comp,
                edgecolor='black', linewidth=1.5, alpha=0.85)
ax3.set_yticks(y_pos_comp)
ax3.set_yticklabels(comparison_banks, fontsize=11, fontweight='bold')
ax3.set_xlabel('Number of Branches', fontsize=12, fontweight='bold')
ax3.set_title('Bank of Baku vs Top 5 Competitors', fontsize=14, fontweight='bold', pad=15)
ax3.invert_yaxis()

# Add value labels
for i, (bar, pct) in enumerate(zip(bars, comparison_pct)):
    width = bar.get_width()
    ax3.text(width + 2, bar.get_y() + bar.get_height()/2,
            f'{int(width)} ({pct:.1f}%)',
            ha='left', va='center', fontweight='bold', fontsize=10,
            color='#e74c3c' if i == 0 else '#2c3e50')

ax3.grid(True, alpha=0.3, axis='x')
ax3.set_xlim(0, max(comparison_values) * 1.15)

# Add gap annotation
if len(comparison_values) > 1:
    gap = comparison_values[1] - comparison_values[0]
    ax3.annotate(f'Gap: {gap} branches',
                xy=(comparison_values[0], 0.5), xytext=(comparison_values[0] + gap/2, 1.5),
                fontsize=10, fontweight='bold', color='#e74c3c',
                ha='center',
                arrowprops=dict(arrowstyle='->', color='#e74c3c', lw=2))

plt.suptitle('Market Share Analysis - Bank of Baku Position',
             fontsize=16, fontweight='bold', y=0.98)

plt.savefig('charts/02_market_share_analysis.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 2 saved")
print()

# ============================================================================
# Chart 3: Geographic scatter plot
# ============================================================================
print("Generating Chart 3: Geographic Distribution...")
fig, ax = plt.subplots(figsize=(18, 12))

# Define distinct color palette for better visibility (20 distinct colors)
distinct_colors = [
    '#e74c3c',  # Red - Bank of Baku
    '#3498db',  # Blue
    '#2ecc71',  # Green
    '#f39c12',  # Orange
    '#9b59b6',  # Purple
    '#1abc9c',  # Turquoise
    '#e67e22',  # Carrot
    '#34495e',  # Dark gray
    '#16a085',  # Green sea
    '#c0392b',  # Dark red
    '#8e44ad',  # Wisteria
    '#27ae60',  # Nephritis
    '#d35400',  # Pumpkin
    '#2c3e50',  # Midnight blue
    '#f1c40f',  # Sunflower
    '#95a5a6',  # Concrete
    '#7f8c8d',  # Asbestos
    '#c39bd3',  # Light purple
    '#76d7c4',  # Light turquoise
    '#f8c471',  # Light orange
]

# Different marker styles for additional distinction
marker_styles = ['o', 'o', 'o', 'o', 'o', 'v', 'v', 'v', 'v', 'v',
                 '^', '^', '^', '^', '^', 'D', 'D', 'D', 'D', 'D']

# Sort banks by count (largest first) for better layering
bank_counts_sorted = df['bank_name'].value_counts()

# Plot all banks with distinct colors and markers
for idx, bank in enumerate(bank_counts_sorted.index):
    bank_data = df[df['bank_name'] == bank]

    if bank == 'Bank of Baku':
        # Bank of Baku - highlighted prominently
        ax.scatter(bank_data['long'], bank_data['lat'],
                  s=200, alpha=0.95, label=bank,
                  color=distinct_colors[0],
                  edgecolors='black', linewidth=2.5, marker='s', zorder=100)
    else:
        # Other banks - use distinct colors and varying markers
        color_idx = idx % len(distinct_colors)
        marker_idx = idx % len(marker_styles)

        ax.scatter(bank_data['long'], bank_data['lat'],
                  s=70, alpha=0.75, label=f'{bank} ({len(bank_data)})',
                  color=distinct_colors[color_idx],
                  marker=marker_styles[marker_idx],
                  edgecolors='white', linewidth=0.5, zorder=idx)

ax.set_xlabel('Longitude', fontsize=12, fontweight='bold')
ax.set_ylabel('Latitude', fontsize=12, fontweight='bold')
ax.set_title('Geographic Distribution of Bank Branches in Azerbaijan\\n(Bank of Baku highlighted as red squares)',
             fontsize=14, fontweight='bold', pad=20)

# Improved legend with branch counts
ax.legend(bbox_to_anchor=(1.02, 1), loc='upper left', fontsize=8,
          ncol=1, frameon=True, fancybox=True, shadow=True)
ax.grid(True, alpha=0.3, linestyle='--', linewidth=0.5)

# Set background color for better contrast
ax.set_facecolor('#f8f9fa')

plt.tight_layout()
plt.savefig('charts/03_geographic_distribution_all.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 3 saved")
print()

# ============================================================================
# Chart 4: Bank of Baku vs top 3 competitors
# ============================================================================
print("Generating Chart 4: Bank of Baku vs Top Competitors...")
top_3_competitors = df['bank_name'].value_counts().head(3).index.tolist()
comparison_banks = ['Bank of Baku'] + [b for b in top_3_competitors if b != 'Bank of Baku'][:3]

fig, axes = plt.subplots(2, 2, figsize=(16, 14))
axes = axes.flatten()

competitor_colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']

for idx, bank in enumerate(comparison_banks):
    ax = axes[idx]

    # Plot all branches with light background
    ax.scatter(df['long'], df['lat'], s=15, alpha=0.15, color='#95a5a6', label='Other banks')

    # Highlight this bank
    bank_data = df[df['bank_name'] == bank]
    color = competitor_colors[idx]
    marker = 's' if bank == 'Bank of Baku' else 'o'

    ax.scatter(bank_data['long'], bank_data['lat'],
              s=120, alpha=0.9, color=color, label=bank,
              marker=marker, edgecolors='black', linewidth=1.5, zorder=5)

    ax.set_title(f'{bank} - {len(bank_data)} branches',
                fontsize=12, fontweight='bold')
    ax.set_xlabel('Longitude', fontsize=10)
    ax.set_ylabel('Latitude', fontsize=10)
    ax.legend(fontsize=9, frameon=True, fancybox=True)
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.set_facecolor('#f8f9fa')

plt.suptitle('Geographic Coverage Comparison: Bank of Baku vs Top Competitors',
             fontsize=16, fontweight='bold', y=1.00)
plt.tight_layout()
plt.savefig('charts/04_bob_vs_competitors_geographic.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 4 saved")
print()

# ============================================================================
# Chart 5: Regional Clustering Analysis
# ============================================================================
print("Generating Chart 5: Regional Clustering...")
coords = df[['lat', 'long']].values
clustering = DBSCAN(eps=0.5, min_samples=5).fit(coords)
df['cluster'] = clustering.labels_

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 7))

# Define distinct colors for clusters
cluster_colors = ['#95a5a6',  # Gray for outliers (cluster -1)
                 '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
                 '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
                 '#8e44ad', '#27ae60', '#d35400', '#2c3e50', '#f1c40f',
                 '#c39bd3', '#76d7c4', '#f8c471', '#ec7063']

# Plot clusters with distinct colors
unique_clusters = sorted(df['cluster'].unique())
for cluster_id in unique_clusters:
    cluster_data = df[df['cluster'] == cluster_id]
    color_idx = (cluster_id + 1) % len(cluster_colors)

    if cluster_id == -1:
        # Outliers - smaller and lighter
        ax1.scatter(cluster_data['long'], cluster_data['lat'],
                   s=40, alpha=0.4, color=cluster_colors[0],
                   label=f'Outliers ({len(cluster_data)})',
                   edgecolors='white', linewidth=0.3, zorder=1)
    else:
        # Clustered branches - larger and more visible
        ax1.scatter(cluster_data['long'], cluster_data['lat'],
                   s=80, alpha=0.85, color=cluster_colors[color_idx],
                   label=f'Cluster {cluster_id} ({len(cluster_data)})',
                   edgecolors='white', linewidth=0.8, zorder=2)

ax1.set_title('Regional Clusters - All Banks', fontsize=14, fontweight='bold')
ax1.set_xlabel('Longitude', fontsize=11)
ax1.set_ylabel('Latitude', fontsize=11)
ax1.grid(True, alpha=0.3, linestyle='--')
ax1.legend(bbox_to_anchor=(1.02, 1), loc='upper left', fontsize=8, ncol=1, frameon=True, fancybox=True)
ax1.set_facecolor('#f8f9fa')

# Bank of Baku presence in clusters
bob_clusters = df[df['bank_name'] == 'Bank of Baku']['cluster'].value_counts().sort_index()
all_clusters = df['cluster'].value_counts().sort_index()

cluster_df = pd.DataFrame({
    'Total Branches': all_clusters,
    'Bank of Baku': bob_clusters
}).fillna(0)

cluster_df.plot(kind='bar', ax=ax2, color=['#3498db', '#e74c3c'])
ax2.set_title('Bank of Baku Presence by Regional Cluster', fontsize=14, fontweight='bold')
ax2.set_xlabel('Cluster ID (-1 = outliers)', fontsize=11)
ax2.set_ylabel('Number of Branches', fontsize=11)
ax2.legend(fontsize=10)
ax2.tick_params(axis='x', rotation=0)

plt.tight_layout()
plt.savefig('charts/05_regional_clustering.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 5 saved")
print(f"  Identified {df['cluster'].nunique() - 1} major regional clusters")
print()

# ============================================================================
# Chart 6: Baku city analysis
# ============================================================================
print("Generating Chart 6: Baku City Analysis...")
baku_df = df[(df['lat'] >= 40.3) & (df['lat'] <= 40.5) &
             (df['long'] >= 49.7) & (df['long'] <= 50.0)].copy()

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 7))

# Use same distinct colors as Chart 3
baku_distinct_colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
    '#8e44ad', '#27ae60', '#d35400', '#2c3e50', '#f1c40f',
    '#95a5a6', '#7f8c8d', '#c39bd3', '#76d7c4', '#f8c471'
]

# Different marker styles for distinction
baku_marker_styles = ['o', 'o', 'o', 'o', 'v', 'v', 'v', 'v',
                      '^', '^', '^', '^', 'D', 'D', 'D', 'D',
                      's', 's', 's', 's']

# Sort banks by count in Baku for better layering
baku_bank_counts = baku_df['bank_name'].value_counts()

# Baku branch distribution
for idx, bank in enumerate(baku_bank_counts.index):
    bank_data = baku_df[baku_df['bank_name'] == bank]
    color_idx = idx % len(baku_distinct_colors)
    marker_idx = idx % len(baku_marker_styles)

    if bank == 'Bank of Baku':
        ax1.scatter(bank_data['long'], bank_data['lat'],
                   s=180, alpha=0.95, label=f'{bank} ({len(bank_data)})',
                   color=baku_distinct_colors[0],
                   edgecolors='black', linewidth=2.5, marker='s', zorder=100)
    else:
        ax1.scatter(bank_data['long'], bank_data['lat'],
                   s=80, alpha=0.8, label=f'{bank} ({len(bank_data)})',
                   color=baku_distinct_colors[color_idx],
                   marker=baku_marker_styles[marker_idx],
                   edgecolors='white', linewidth=0.8, zorder=idx)

ax1.set_xlabel('Longitude', fontsize=11)
ax1.set_ylabel('Latitude', fontsize=11)
ax1.set_title('Baku City - Branch Distribution\n(Bank of Baku highlighted as red squares)',
             fontsize=14, fontweight='bold')
ax1.legend(bbox_to_anchor=(1.05, 1), loc='upper left', fontsize=8,
          frameon=True, fancybox=True, shadow=True)
ax1.grid(True, alpha=0.3, linestyle='--')
ax1.set_facecolor('#f8f9fa')

# Baku market share
baku_counts = baku_df['bank_name'].value_counts()
colors = ['#e74c3c' if bank == 'Bank of Baku' else '#3498db' for bank in baku_counts.index]
baku_counts.plot(kind='barh', ax=ax2, color=colors)
ax2.set_xlabel('Number of Branches', fontsize=11)
ax2.set_ylabel('Bank Name', fontsize=11)
ax2.set_title('Baku City - Branch Count by Bank', fontsize=14, fontweight='bold')

for i, v in enumerate(baku_counts.values):
    ax2.text(v + 0.5, i, str(v), va='center', fontweight='bold')

plt.tight_layout()
plt.savefig('charts/06_baku_city_analysis.png', dpi=300, bbox_inches='tight')
plt.close()

bob_baku = len(baku_df[baku_df['bank_name'] == 'Bank of Baku'])
total_baku = len(baku_df)

print(f"✓ Chart 6 saved")
print(f"  Baku: {bob_baku} Bank of Baku branches out of {total_baku} total ({bob_baku/total_baku*100:.1f}%)")
print()

# ============================================================================
# Chart 7: Baku vs Regions comparison
# ============================================================================
print("Generating Chart 7: Baku vs Regions...")
df['region'] = df.apply(lambda row: 'Baku' if (40.3 <= row['lat'] <= 40.5 and 49.7 <= row['long'] <= 50.0) else 'Regions', axis=1)

fig, axes = plt.subplots(1, 3, figsize=(18, 6))

# Regional distribution for all banks
region_dist = df.groupby(['bank_name', 'region']).size().unstack(fill_value=0)
region_dist.plot(kind='bar', ax=axes[0], color=['#3498db', '#e74c3c'], width=0.8)
axes[0].set_title('Baku vs Regions - All Banks', fontsize=12, fontweight='bold')
axes[0].set_xlabel('Bank', fontsize=10)
axes[0].set_ylabel('Number of Branches', fontsize=10)
axes[0].tick_params(axis='x', rotation=45)
axes[0].legend(title='Region')

# Bank of Baku specific
bob_region = df[df['bank_name'] == 'Bank of Baku']['region'].value_counts()
bob_region.plot(kind='pie', ax=axes[1], autopct='%1.1f%%',
                colors=['#3498db', '#e74c3c'], startangle=90)
axes[1].set_title('Bank of Baku: Baku vs Regions', fontsize=12, fontweight='bold')
axes[1].set_ylabel('')

# Percentage in regions
region_pct = region_dist.div(region_dist.sum(axis=1), axis=0) * 100
region_pct['Regions'].sort_values(ascending=True).plot(kind='barh', ax=axes[2], color='#2ecc71')
axes[2].set_title('Regional Coverage - % of Branches Outside Baku', fontsize=12, fontweight='bold')
axes[2].set_xlabel('Percentage (%)', fontsize=10)
axes[2].set_ylabel('Bank', fontsize=10)

for i, v in enumerate(region_pct['Regions'].sort_values(ascending=True).values):
    axes[2].text(v + 1, i, f'{v:.1f}%', va='center')

plt.tight_layout()
plt.savefig('charts/07_baku_vs_regions.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 7 saved")
print()

# ============================================================================
# Chart 8: Competitive density heatmap
# ============================================================================
print("Generating Chart 8: Competitive Density...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 7))

# Density for all banks
xy_all = np.vstack([df['long'], df['lat']])
z_all = gaussian_kde(xy_all)(xy_all)
scatter1 = ax1.scatter(df['long'], df['lat'], c=z_all, s=65, cmap='YlOrRd', alpha=0.7, edgecolors='white', linewidth=0.5)
ax1.set_title('Branch Density Heatmap - All Banks', fontsize=14, fontweight='bold')
ax1.set_xlabel('Longitude', fontsize=11)
ax1.set_ylabel('Latitude', fontsize=11)
plt.colorbar(scatter1, ax=ax1, label='Density')
ax1.grid(True, alpha=0.3, linestyle='--')
ax1.set_facecolor('#f8f9fa')

# Bank of Baku branches overlaid on competition density
competitors_df = df[df['bank_name'] != 'Bank of Baku']
xy_comp = np.vstack([competitors_df['long'], competitors_df['lat']])
z_comp = gaussian_kde(xy_comp)(xy_comp)

scatter2 = ax2.scatter(competitors_df['long'], competitors_df['lat'],
                       c=z_comp, s=40, cmap='Blues', alpha=0.5, edgecolors='white', linewidth=0.3)
bob_df = df[df['bank_name'] == 'Bank of Baku']
ax2.scatter(bob_df['long'], bob_df['lat'],
           s=280, alpha=0.95, color='#e74c3c',
           edgecolors='black', linewidth=2.5, marker='*',
           label='Bank of Baku', zorder=10)

ax2.set_title('Bank of Baku Locations vs Competitor Density', fontsize=14, fontweight='bold')
ax2.set_xlabel('Longitude', fontsize=11)
ax2.set_ylabel('Latitude', fontsize=11)
plt.colorbar(scatter2, ax=ax2, label='Competitor Density')
ax2.legend(fontsize=11, frameon=True, fancybox=True, shadow=True)
ax2.grid(True, alpha=0.3, linestyle='--')
ax2.set_facecolor('#f8f9fa')

plt.tight_layout()
plt.savefig('charts/08_competitive_density.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 8 saved")
print()

# ============================================================================
# Chart 9: Gap Analysis - Underserved Areas
# ============================================================================
print("Generating Chart 9: Gap Analysis...")
bob_coords = df[df['bank_name'] == 'Bank of Baku'][['lat', 'long']].values
comp_coords = df[df['bank_name'] != 'Bank of Baku'][['lat', 'long']].values
comp_banks = df[df['bank_name'] != 'Bank of Baku']['bank_name'].values

# Calculate distance to nearest Bank of Baku branch
nbrs = NearestNeighbors(n_neighbors=1).fit(bob_coords)
distances, indices = nbrs.kneighbors(comp_coords)

# Create dataframe of competitor locations with their distance to nearest BoB
gap_df = pd.DataFrame({
    'lat': comp_coords[:, 0],
    'long': comp_coords[:, 1],
    'bank': comp_banks,
    'distance_to_bob': distances.flatten()
})

# Find significant gaps (> 0.3 degrees, roughly 30km)
gaps = gap_df[gap_df['distance_to_bob'] > 0.3].sort_values('distance_to_bob', ascending=False)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 7))

# Map of gaps
ax1.scatter(df['long'], df['lat'], s=20, alpha=0.2, color='gray', label='All branches')
ax1.scatter(bob_coords[:, 1], bob_coords[:, 0],
           s=100, alpha=0.8, color='#e74c3c',
           edgecolors='black', linewidth=1, marker='s', label='Bank of Baku', zorder=5)
ax1.scatter(gaps['long'], gaps['lat'],
           s=gaps['distance_to_bob']*200, alpha=0.6, color='#f39c12',
           edgecolors='black', linewidth=1, label='Gap opportunities', zorder=3)

ax1.set_xlabel('Longitude', fontsize=11)
ax1.set_ylabel('Latitude', fontsize=11)
ax1.set_title('Market Gaps - Competitor Locations Far from Bank of Baku\\n(Larger circles = greater distance)',
             fontsize=13, fontweight='bold')
ax1.legend(fontsize=10)
ax1.grid(True, alpha=0.3)

# Top gap opportunities
top_gaps = gaps.head(15)
ax2.scatter(range(len(top_gaps)), top_gaps['distance_to_bob'],
           s=100, alpha=0.7, color='#f39c12', edgecolors='black', linewidth=1)
ax2.set_xlabel('Opportunity Rank', fontsize=11)
ax2.set_ylabel('Distance to Nearest Bank of Baku Branch (degrees)', fontsize=11)
ax2.set_title('Top 15 Expansion Opportunities by Distance', fontsize=13, fontweight='bold')
ax2.grid(True, alpha=0.3)

# Add horizontal line for average
ax2.axhline(y=gaps['distance_to_bob'].mean(), color='r', linestyle='--',
           label=f'Average: {gaps["distance_to_bob"].mean():.2f}°', linewidth=2)
ax2.legend(fontsize=10)

plt.tight_layout()
plt.savefig('charts/09_gap_analysis.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 9 saved")
print(f"  Found {len(gaps)} expansion opportunity locations")
print()

# ============================================================================
# Chart 10: Nearest Competitor Analysis
# ============================================================================
print("Generating Chart 10: Nearest Competitor Analysis...")
nbrs_comp = NearestNeighbors(n_neighbors=1).fit(comp_coords)
dist_to_comp, idx_comp = nbrs_comp.kneighbors(bob_coords)

bob_analysis = df[df['bank_name'] == 'Bank of Baku'].copy()
bob_analysis['dist_to_competitor'] = dist_to_comp.flatten()
bob_analysis['nearest_competitor'] = [comp_banks[i] for i in idx_comp.flatten()]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 7))

# Distribution of distances - Enhanced histogram
n, bins, patches = ax1.hist(bob_analysis['dist_to_competitor'], bins=15,
                             edgecolor='black', linewidth=1.5, alpha=0.85)

# Color bars with gradient based on distance (closer = red, farther = green)
colors = ['#e74c3c', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71',
          '#27ae60', '#16a085', '#1abc9c', '#3498db', '#2980b9',
          '#8e44ad', '#9b59b6', '#34495e', '#7f8c8d', '#95a5a6']
for i, patch in enumerate(patches):
    patch.set_facecolor(colors[i % len(colors)])

# Add prominent mean and median lines
mean_val = bob_analysis['dist_to_competitor'].mean()
median_val = bob_analysis['dist_to_competitor'].median()

ax1.axvline(mean_val, color='#e74c3c', linestyle='--', linewidth=3.5,
           label=f'Mean: {mean_val:.4f}° (~{mean_val*111:.1f}km)', zorder=10, alpha=0.9)
ax1.axvline(median_val, color='#2ecc71', linestyle='--', linewidth=3.5,
           label=f'Median: {median_val:.4f}° (~{median_val*111:.1f}km)', zorder=10, alpha=0.9)

# Add value labels on top of bars
for i, (count, bin_edge) in enumerate(zip(n, bins[:-1])):
    if count > 0:
        ax1.text(bin_edge + (bins[1]-bins[0])/2, count + max(n)*0.02,
                int(count), ha='center', va='bottom', fontweight='bold', fontsize=9)

ax1.set_xlabel('Distance to Nearest Competitor (degrees)\n[1° ≈ 111 km]',
              fontsize=11, fontweight='bold')
ax1.set_ylabel('Number of Bank of Baku Branches', fontsize=11, fontweight='bold')
ax1.set_title('Bank of Baku: Distance to Nearest Competitor Distribution\n(Redder bars = closer, Greener bars = farther)',
             fontsize=13, fontweight='bold')
ax1.legend(fontsize=10, frameon=True, fancybox=True, shadow=True, loc='upper right')
ax1.grid(True, alpha=0.3, axis='y', linestyle='--')
ax1.set_facecolor('#f8f9fa')

# Nearest competitor frequency
nearest_comp_counts = bob_analysis['nearest_competitor'].value_counts()
nearest_comp_counts.plot(kind='barh', ax=ax2, color='#9b59b6')
ax2.set_xlabel('Number of Times as Nearest Competitor', fontsize=11)
ax2.set_ylabel('Bank Name', fontsize=11)
ax2.set_title('Most Frequent Direct Competitors to Bank of Baku Branches',
             fontsize=13, fontweight='bold')

for i, v in enumerate(nearest_comp_counts.values):
    ax2.text(v + 0.2, i, str(v), va='center', fontweight='bold')

plt.tight_layout()
plt.savefig('charts/10_nearest_competitor_analysis.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 10 saved")
print()

# ============================================================================
# Chart 11: Competitive Intensity Index
# ============================================================================
print("Generating Chart 11: Competitive Intensity...")

def calculate_competitive_intensity(bank_name, radius=0.1):
    bank_coords = df[df['bank_name'] == bank_name][['lat', 'long']].values
    all_coords = df[['lat', 'long']].values

    intensities = []
    for coord in bank_coords:
        # Calculate distances to all branches
        distances = np.sqrt(((all_coords - coord)**2).sum(axis=1))
        # Count branches within radius (excluding self)
        nearby = (distances > 0) & (distances < radius)
        intensities.append(nearby.sum())

    return intensities

# Calculate for all banks
intensity_data = {}
for bank in df['bank_name'].unique():
    intensity_data[bank] = calculate_competitive_intensity(bank)

# Create comparison dataframe
intensity_comparison = pd.DataFrame([
    {
        'Bank': bank,
        'Avg_Competitors_Nearby': np.mean(intensities),
        'Max_Competitors_Nearby': np.max(intensities),
        'Min_Competitors_Nearby': np.min(intensities)
    }
    for bank, intensities in intensity_data.items()
]).sort_values('Avg_Competitors_Nearby', ascending=False)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 7))

# Average competitive intensity
colors = ['#e74c3c' if bank == 'Bank of Baku' else '#3498db'
          for bank in intensity_comparison['Bank']]
ax1.barh(intensity_comparison['Bank'], intensity_comparison['Avg_Competitors_Nearby'],
        color=colors)
ax1.set_xlabel('Average Number of Competitors Within 10km', fontsize=11)
ax1.set_ylabel('Bank', fontsize=11)
ax1.set_title('Average Competitive Intensity by Bank', fontsize=13, fontweight='bold')

for i, v in enumerate(intensity_comparison['Avg_Competitors_Nearby'].values):
    ax1.text(v + 0.5, i, f'{v:.1f}', va='center', fontweight='bold')

# Bank of Baku intensity distribution - Enhanced histogram
bob_intensities = intensity_data['Bank of Baku']
n, bins, patches = ax2.hist(bob_intensities, bins=15, edgecolor='black', linewidth=1.5, alpha=0.85)

# Color bars with gradient: fewer competitors = green (good), more = red (high pressure)
colors_intensity = ['#2ecc71', '#27ae60', '#16a085', '#1abc9c', '#3498db',
                   '#2980b9', '#8e44ad', '#9b59b6', '#e67e22', '#f39c12',
                   '#f1c40f', '#e74c3c', '#c0392b', '#d35400', '#c0392b']
for i, patch in enumerate(patches):
    patch.set_facecolor(colors_intensity[i % len(colors_intensity)])

# Add prominent mean and median lines
mean_intensity = np.mean(bob_intensities)
median_intensity = np.median(bob_intensities)

ax2.axvline(mean_intensity, color='#e74c3c', linestyle='--', linewidth=3.5,
           label=f'Mean: {mean_intensity:.1f} competitors', zorder=10, alpha=0.9)
ax2.axvline(median_intensity, color='#2ecc71', linestyle='--', linewidth=3.5,
           label=f'Median: {median_intensity:.1f} competitors', zorder=10, alpha=0.9)

# Add value labels on top of bars
for i, (count, bin_edge) in enumerate(zip(n, bins[:-1])):
    if count > 0:
        ax2.text(bin_edge + (bins[1]-bins[0])/2, count + max(n)*0.02,
                int(count), ha='center', va='bottom', fontweight='bold', fontsize=9)

ax2.set_xlabel('Number of Competitors Within 10km', fontsize=11, fontweight='bold')
ax2.set_ylabel('Number of Bank of Baku Branches', fontsize=11, fontweight='bold')
ax2.set_title('Bank of Baku: Competitive Intensity Distribution\n(Greener bars = lower competition, Redder bars = higher competition)',
             fontsize=13, fontweight='bold')
ax2.legend(fontsize=10, frameon=True, fancybox=True, shadow=True, loc='upper right')
ax2.grid(True, alpha=0.3, axis='y', linestyle='--')
ax2.set_facecolor('#f8f9fa')

plt.tight_layout()
plt.savefig('charts/11_competitive_intensity.png', dpi=300, bbox_inches='tight')
plt.close()

bob_avg_intensity = intensity_comparison[intensity_comparison['Bank'] == 'Bank of Baku']['Avg_Competitors_Nearby'].values[0]

print(f"✓ Chart 11 saved")
print(f"  Bank of Baku avg competitive intensity: {bob_avg_intensity:.1f} competitors within 10km")
print()

# ============================================================================
# Chart 12: Market Share by Geographic Quadrants
# ============================================================================
print("Generating Chart 12: Quadrant Analysis...")
lat_median = df['lat'].median()
long_median = df['long'].median()

def assign_quadrant(row):
    if row['lat'] >= lat_median and row['long'] >= long_median:
        return 'Northeast'
    elif row['lat'] >= lat_median and row['long'] < long_median:
        return 'Northwest'
    elif row['lat'] < lat_median and row['long'] >= long_median:
        return 'Southeast'
    else:
        return 'Southwest'

df['quadrant'] = df.apply(assign_quadrant, axis=1)

fig, axes = plt.subplots(2, 2, figsize=(16, 14))
axes = axes.flatten()

quadrants = ['Northeast', 'Northwest', 'Southeast', 'Southwest']

for idx, quadrant in enumerate(quadrants):
    ax = axes[idx]
    quad_data = df[df['quadrant'] == quadrant]
    quad_counts = quad_data['bank_name'].value_counts()

    colors = ['#e74c3c' if bank == 'Bank of Baku' else '#3498db' for bank in quad_counts.index]
    quad_counts.plot(kind='barh', ax=ax, color=colors)

    ax.set_title(f'{quadrant} Quadrant ({len(quad_data)} branches)',
                fontsize=12, fontweight='bold')
    ax.set_xlabel('Number of Branches', fontsize=10)
    ax.set_ylabel('Bank', fontsize=10)

    # Add value labels
    for i, v in enumerate(quad_counts.values):
        ax.text(v + 0.3, i, str(v), va='center', fontsize=9)

plt.suptitle('Market Share Analysis by Geographic Quadrants',
             fontsize=16, fontweight='bold', y=0.995)
plt.tight_layout()
plt.savefig('charts/12_quadrant_analysis.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 12 saved")
print()

# ============================================================================
# Chart 13: Growth Opportunity Score
# ============================================================================
print("Generating Chart 13: Growth Opportunity Score...")

# Create grid of potential locations
lat_min, lat_max = df['lat'].min() - 0.1, df['lat'].max() + 0.1
long_min, long_max = df['long'].min() - 0.1, df['long'].max() + 0.1

# Create grid points
grid_resolution = 30
lat_grid = np.linspace(lat_min, lat_max, grid_resolution)
long_grid = np.linspace(long_min, long_max, grid_resolution)
grid_points = np.array([[lat, long] for lat in lat_grid for long in long_grid])

# Calculate opportunity score for each grid point
def calculate_opportunity_score(point):
    # Distance to nearest BoB branch (higher = better)
    distances_bob = np.sqrt(((bob_coords - point)**2).sum(axis=1))
    dist_score = distances_bob.min()

    # Number of competitors nearby (higher = more demand)
    distances_comp = np.sqrt(((comp_coords - point)**2).sum(axis=1))
    nearby_comps = (distances_comp < 0.2).sum()  # Within ~20km

    # Combined score (normalize both)
    score = dist_score * 10 + nearby_comps * 0.5
    return score

opportunity_scores = np.array([calculate_opportunity_score(point) for point in grid_points])
opportunity_scores = opportunity_scores.reshape(grid_resolution, grid_resolution)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 7))

# Heatmap of opportunity scores
im = ax1.contourf(long_grid, lat_grid, opportunity_scores, levels=20, cmap='YlOrRd', alpha=0.8)
ax1.scatter(bob_coords[:, 1], bob_coords[:, 0], s=140, color='#e74c3c',
           marker='s', edgecolors='black', linewidth=2.5, label='Bank of Baku', zorder=5)
ax1.scatter(comp_coords[:, 1], comp_coords[:, 0], s=15, color='gray',
           alpha=0.4, label='Competitors', edgecolors='white', linewidth=0.2)
ax1.set_xlabel('Longitude', fontsize=11)
ax1.set_ylabel('Latitude', fontsize=11)
ax1.set_title('Expansion Opportunity Heatmap for Bank of Baku\n(Warmer colors = higher opportunity)',
             fontsize=13, fontweight='bold')
ax1.legend(fontsize=10, frameon=True, fancybox=True)
ax1.grid(True, alpha=0.3, linestyle='--')
ax1.set_facecolor('#f8f9fa')
plt.colorbar(im, ax=ax1, label='Opportunity Score')

# Top opportunity locations
top_n = 20
flat_indices = opportunity_scores.flatten().argsort()[-top_n:][::-1]
top_opportunities = grid_points[flat_indices]

# Plot top opportunities
ax2.scatter(df['long'], df['lat'], s=18, alpha=0.2, color='#95a5a6', label='Existing branches')
ax2.scatter(bob_coords[:, 1], bob_coords[:, 0], s=140, color='#e74c3c',
           marker='s', edgecolors='black', linewidth=2.5, label='Bank of Baku', zorder=5)
ax2.scatter(top_opportunities[:, 1], top_opportunities[:, 0],
           s=320, color='#f39c12', marker='*',
           edgecolors='black', linewidth=2, label='Top expansion opportunities', zorder=10, alpha=0.95)

# Number the top 5
for i in range(min(5, len(top_opportunities))):
    ax2.annotate(str(i+1), (top_opportunities[i, 1], top_opportunities[i, 0]),
                fontsize=11, fontweight='bold', ha='center', va='center', color='white',
                bbox=dict(boxstyle='circle', facecolor='#2c3e50', edgecolor='white', linewidth=2))

ax2.set_xlabel('Longitude', fontsize=11)
ax2.set_ylabel('Latitude', fontsize=11)
ax2.set_title(f'Top {top_n} Recommended Expansion Locations', fontsize=13, fontweight='bold')
ax2.legend(fontsize=10, frameon=True, fancybox=True, shadow=True)
ax2.grid(True, alpha=0.3, linestyle='--')
ax2.set_facecolor('#f8f9fa')

plt.tight_layout()
plt.savefig('charts/13_growth_opportunity_score.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 13 saved")
print()

# ============================================================================
# Chart 14: Multi-metric comparison with top banks
# ============================================================================
print("Generating Chart 14: Multi-Metric Comparison...")

top_5_banks = df['bank_name'].value_counts().head(5).index
if 'Bank of Baku' not in top_5_banks:
    comparison_banks = list(top_5_banks[:4]) + ['Bank of Baku']
else:
    comparison_banks = list(top_5_banks)

# Calculate multiple metrics for each bank
metrics = []
for bank in comparison_banks:
    bank_data = df[df['bank_name'] == bank]

    # Geographic spread
    lat_range = bank_data['lat'].max() - bank_data['lat'].min()
    long_range = bank_data['long'].max() - bank_data['long'].min()
    geo_spread = lat_range + long_range

    # Baku vs Regional
    baku_pct = (bank_data['region'] == 'Baku').sum() / len(bank_data) * 100

    # Average competitive intensity
    avg_intensity = np.mean(intensity_data[bank])

    metrics.append({
        'Bank': bank,
        'Branch_Count': len(bank_data),
        'Geographic_Spread': geo_spread,
        'Baku_Percentage': baku_pct,
        'Avg_Competitive_Intensity': avg_intensity
    })

metrics_df = pd.DataFrame(metrics)

# Normalize metrics for radar chart
metrics_normalized = metrics_df.copy()
for col in ['Branch_Count', 'Geographic_Spread', 'Baku_Percentage', 'Avg_Competitive_Intensity']:
    max_val = metrics_normalized[col].max()
    if max_val > 0:
        metrics_normalized[col] = metrics_normalized[col] / max_val * 100

# Create radar chart
categories = ['Branch Count', 'Geographic\\nSpread', 'Baku\\nFocus', 'Competitive\\nIntensity']
N = len(categories)

fig = plt.figure(figsize=(18, 8))
ax1 = plt.subplot(121, projection='polar')
ax2 = plt.subplot(122)

angles = [n / float(N) * 2 * np.pi for n in range(N)]
angles += angles[:1]

# Plot each bank
for idx, row in metrics_normalized.iterrows():
    values = row[['Branch_Count', 'Geographic_Spread', 'Baku_Percentage',
                 'Avg_Competitive_Intensity']].values.tolist()
    values += values[:1]

    if row['Bank'] == 'Bank of Baku':
        ax1.plot(angles, values, 'o-', linewidth=3, label=row['Bank'], color='#e74c3c')
        ax1.fill(angles, values, alpha=0.15, color='#e74c3c')
    else:
        ax1.plot(angles, values, 'o-', linewidth=1.5, label=row['Bank'], alpha=0.7)

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(categories, fontsize=10)
ax1.set_ylim(0, 100)
ax1.set_title('Multi-Metric Comparison: Bank of Baku vs Leaders\\n(Normalized to 100)',
             fontsize=13, fontweight='bold', pad=20)
ax1.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), fontsize=9)
ax1.grid(True)

# Comparison table
ax2.axis('tight')
ax2.axis('off')

table_data = []
for idx, row in metrics_df.iterrows():
    table_data.append([
        row['Bank'],
        f"{int(row['Branch_Count'])}",
        f"{row['Geographic_Spread']:.2f}",
        f"{row['Baku_Percentage']:.1f}%",
        f"{row['Avg_Competitive_Intensity']:.1f}"
    ])

table = ax2.table(cellText=table_data,
                 colLabels=['Bank', 'Branches', 'Geo Spread', 'Baku %', 'Comp. Intensity'],
                 cellLoc='center',
                 loc='center',
                 bbox=[0, 0, 1, 1])

table.auto_set_font_size(False)
table.set_fontsize(10)
table.scale(1, 2)

# Color Bank of Baku row
for i, row in enumerate(table_data):
    if row[0] == 'Bank of Baku':
        for j in range(5):
            table[(i+1, j)].set_facecolor('#ffcccc')

# Header style
for j in range(5):
    table[(0, j)].set_facecolor('#3498db')
    table[(0, j)].set_text_props(weight='bold', color='white')

ax2.set_title('Detailed Metrics Comparison', fontsize=13, fontweight='bold', pad=20)

plt.tight_layout()
plt.savefig('charts/14_multimetric_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 14 saved")
print()

# ============================================================================
# Chart 15: Executive Summary Dashboard (Visual Only)
# ============================================================================
print("Generating Chart 15: Executive Summary Dashboard...")

fig = plt.figure(figsize=(18, 10))
gs = fig.add_gridspec(2, 3, hspace=0.35, wspace=0.35)

# 1. Market Position Ranking
ax1 = fig.add_subplot(gs[0, 0])
top_banks = df['bank_name'].value_counts().head(8)
colors_rank = ['#e74c3c' if bank == 'Bank of Baku' else '#95a5a6' for bank in top_banks.index]
bars = ax1.barh(range(len(top_banks)), top_banks.values, color=colors_rank, edgecolor='black', linewidth=1.2)
ax1.set_yticks(range(len(top_banks)))
ax1.set_yticklabels([f'#{i+1}. {bank}' for i, bank in enumerate(top_banks.index)], fontsize=10)
ax1.set_xlabel('Number of Branches', fontsize=11, fontweight='bold')
ax1.set_title('Market Position: Branch Count Rankings', fontsize=12, fontweight='bold')
ax1.invert_yaxis()
for i, v in enumerate(top_banks.values):
    ax1.text(v + 2, i, str(v), va='center', fontweight='bold', fontsize=10)
ax1.grid(True, alpha=0.3, axis='x')

# 2. Key Metrics Comparison
ax2 = fig.add_subplot(gs[0, 1])
metric_comparison = pd.DataFrame({
    'Metric': ['Branches', 'Market\nShare %', 'Regional\nCoverage %'],
    'Bank of Baku': [bob_count, bob_count/total_count*100, bob_region['Regions']/bob_count*100],
    'Industry Avg': [
        df.groupby('bank_name').size().mean(),
        100/df['bank_name'].nunique(),
        df.groupby('bank_name')['region'].apply(lambda x: (x=='Regions').sum()/len(x)*100).mean()
    ]
})

x = np.arange(len(metric_comparison))
width = 0.35
bars1 = ax2.bar(x - width/2, metric_comparison['Bank of Baku'], width, label='Bank of Baku',
                color='#e74c3c', edgecolor='black', linewidth=1.2)
bars2 = ax2.bar(x + width/2, metric_comparison['Industry Avg'], width, label='Industry Avg',
                color='#3498db', edgecolor='black', linewidth=1.2)
ax2.set_ylabel('Value', fontsize=11, fontweight='bold')
ax2.set_title('Bank of Baku vs Industry Average', fontsize=12, fontweight='bold')
ax2.set_xticks(x)
ax2.set_xticklabels(metric_comparison['Metric'], fontsize=10)
ax2.legend(fontsize=10, loc='upper right')
ax2.grid(True, alpha=0.3, axis='y')

# Add value labels on bars
for bars in [bars1, bars2]:
    for bar in bars:
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.1f}', ha='center', va='bottom', fontsize=8, fontweight='bold')

# 3. Expansion Opportunities
ax3 = fig.add_subplot(gs[0, 2])
cluster_df['BoB_Share'] = (cluster_df['Bank of Baku'] / cluster_df['Total Branches'] * 100).fillna(0)
opportunity_summary = pd.DataFrame({
    'Category': ['High Gap\nAreas', 'Underserved\nClusters', 'Regional\nGap'],
    'Count': [
        len(gaps),
        (cluster_df['BoB_Share'] < 5).sum(),
        df.groupby('bank_name')['region'].apply(lambda x: (x=='Regions').sum()).max() - bob_region['Regions']
    ]
})

bars = ax3.bar(opportunity_summary['Category'], opportunity_summary['Count'],
               color='#f39c12', edgecolor='black', linewidth=1.5, alpha=0.8)
ax3.set_ylabel('Number of Opportunities', fontsize=11, fontweight='bold')
ax3.set_title('Expansion Opportunities', fontsize=12, fontweight='bold')
ax3.tick_params(axis='x', labelsize=10)

for i, (bar, v) in enumerate(zip(bars, opportunity_summary['Count'])):
    height = bar.get_height()
    ax3.text(bar.get_x() + bar.get_width()/2., height,
            str(int(v)), ha='center', va='bottom', fontweight='bold', fontsize=11)
ax3.grid(True, alpha=0.3, axis='y')

# 4. Baku vs Regional Distribution
ax4 = fig.add_subplot(gs[1, 0])
bob_region_pct = bob_region / bob_count * 100
colors_region = ['#3498db', '#e74c3c']
explode_region = [0.05, 0.05]
wedges, texts, autotexts = ax4.pie(bob_region_pct.values,
                                     labels=bob_region_pct.index,
                                     autopct=lambda pct: f'{pct:.1f}%\n({int(pct/100*bob_count)} br.)',
                                     colors=colors_region,
                                     explode=explode_region,
                                     startangle=90,
                                     textprops={'fontsize': 11, 'fontweight': 'bold'})
ax4.set_title('Bank of Baku: Geographic Distribution', fontsize=12, fontweight='bold')

# 5. Direct Competitors
ax5 = fig.add_subplot(gs[1, 1])
nearest_top5 = nearest_comp_counts.head(5)
colors_comp = plt.cm.Set3(range(len(nearest_top5)))
wedges, texts, autotexts = ax5.pie(nearest_top5.values,
                                     labels=nearest_top5.index,
                                     autopct='%1.0f%%',
                                     colors=colors_comp,
                                     startangle=90,
                                     textprops={'fontsize': 9})
ax5.set_title('Most Frequent Direct Competitors', fontsize=12, fontweight='bold')

# 6. Competitive Intensity Distribution
ax6 = fig.add_subplot(gs[1, 2])
bob_intensities = intensity_data['Bank of Baku']
ax6.hist(bob_intensities, bins=12, color='#e74c3c', alpha=0.7,
        edgecolor='black', linewidth=1.5)
ax6.axvline(np.mean(bob_intensities), color='black', linestyle='--',
           linewidth=2.5, label=f'Mean: {np.mean(bob_intensities):.1f}', zorder=5)
ax6.set_xlabel('Competitors Within 10km Radius', fontsize=11, fontweight='bold')
ax6.set_ylabel('Number of BoB Branches', fontsize=11, fontweight='bold')
ax6.set_title('Competitive Intensity Distribution', fontsize=12, fontweight='bold')
ax6.legend(fontsize=10, loc='upper right')
ax6.grid(True, alpha=0.3, axis='y')

plt.suptitle('Bank of Baku - Executive Summary Dashboard',
             fontsize=16, fontweight='bold', y=0.98)
plt.savefig('charts/15_executive_summary_dashboard.png', dpi=300, bbox_inches='tight')
plt.close()

print(f"✓ Chart 15 saved")
print()

# ============================================================================
# Generate Strategic Insights Report (Text File)
# ============================================================================
print("Generating Strategic Insights Report...")

insights_report = f"""
================================================================================
BANK OF BAKU - STRATEGIC ANALYSIS & ACTIONABLE INSIGHTS
================================================================================
Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}

EXECUTIVE SUMMARY
================================================================================

CURRENT MARKET POSITION:
• Market Rank: #{bob_rank} out of {df['bank_name'].nunique()} banks
• Total Branches: {bob_count}
• Market Share: {bob_count/total_count*100:.1f}%
• Gap to Market Leader (Kapital Bank): {branch_counts.max() - bob_count} branches

GEOGRAPHIC FOOTPRINT:
• Baku Concentration: {bob_region['Baku']}/{bob_count} branches ({bob_region['Baku']/bob_count*100:.1f}%)
• Regional Presence: {bob_region['Regions']}/{bob_count} branches ({bob_region['Regions']/bob_count*100:.1f}%)
• Average Competitive Intensity: {bob_avg_intensity:.1f} competitors within 10km radius

COMPETITIVE LANDSCAPE:
• Most Frequent Direct Competitors: {', '.join(nearest_comp_counts.head(3).index.tolist())}
• Average Distance to Nearest Competitor: {bob_analysis['dist_to_competitor'].mean():.4f}° (~{bob_analysis['dist_to_competitor'].mean()*111:.1f}km)
• Total Market Competitors Identified: {len(gaps)} competitor locations >30km from nearest BoB branch

================================================================================
STRATEGIC RECOMMENDATIONS
================================================================================

1. REGIONAL EXPANSION (PRIORITY: HIGH)

   Current Situation:
   • Bank of Baku's regional coverage ({bob_region['Regions']/bob_count*100:.1f}%) is significantly below
     the industry average ({df.groupby('bank_name')['region'].apply(lambda x: (x=='Regions').sum()/len(x)*100).mean():.1f}%)
   • Heavy concentration in Baku ({bob_region['Baku']/bob_count*100:.1f}%) limits growth potential
   • {len(gaps)} high-potential locations identified where competitors operate without BoB presence

   Recommended Actions:
   • Prioritize expansion into regional cities with existing competitor presence
   • Focus on underserved clusters where BoB market share is below 5%
   • Target cities like: Ganja, Sumqayit, Lankaran, Mingachevir, Shirvan
   • Allocate 60% of new branch budget to regional expansion

   Expected Impact:
   • Increase market coverage by accessing untapped customer segments
   • Reduce dependency on Baku market
   • Improve competitive positioning in regional markets

2. STRATEGIC LOCATION SELECTION (PRIORITY: HIGH)

   Current Situation:
   • Gap Analysis identified {len(gaps)} competitor locations far from BoB branches
   • Growth Opportunity Score analysis pinpointed top 20 optimal expansion coordinates
   • Current branches face high competitive intensity ({bob_avg_intensity:.1f} competitors within 10km)

   Recommended Actions:
   • Use the Growth Opportunity Heatmap (Chart 13) to identify specific coordinates
   • Balance two factors: (a) distance from existing BoB branches, (b) proximity to competitor activity
   • Prioritize locations with distance >0.3° from nearest BoB branch
   • Focus on areas with moderate competitor presence (indicates demand but not oversaturation)

   Top Expansion Locations:
   (Refer to Chart 13 for precise coordinates of top 20 opportunities)
   • Locations are ranked by combined score of market gap and competitor density
   • Each location represents validated market demand (competitor presence) without BoB coverage

   Expected Impact:
   • Capture market share in underserved areas before competitors expand
   • Reduce customer travel distance to nearest BoB branch
   • Optimal resource allocation with data-driven site selection

3. COMPETITIVE POSITIONING (PRIORITY: MEDIUM)

   Current Situation:
   • Main competitors in proximity: {', '.join(nearest_top5.index[:3].tolist())}
   • Average {bob_avg_intensity:.1f} competitors within 10km of each BoB branch
   • High competitive intensity in Baku market

   Recommended Actions:
   • Develop differentiation strategy beyond location convenience
   • Focus on service excellence, digital banking, and customer experience
   • Consider specialized branches (e.g., SME-focused, wealth management)
   • In highly competitive areas, emphasize brand differentiation over proximity

   Expected Impact:
   • Stronger brand positioning despite fewer branches than leaders
   • Customer loyalty based on service quality, not just convenience
   • Better performance metrics per branch

4. MARKET SHARE GROWTH PATH (PRIORITY: MEDIUM)

   Current Situation:
   • Current market share: {bob_count/total_count*100:.1f}%
   • To reach 10% market share: Need {int(total_count * 0.10) - bob_count} additional branches
   • To match #5 position: Need {sorted(branch_counts.values, reverse=True)[4] - bob_count} additional branches

   Recommended Growth Strategy:

   Phase 1 (Year 1): Add {int((int(total_count * 0.10) - bob_count) * 0.4)} branches
   • 60% in regional areas (identified gap locations)
   • 40% in Baku suburbs (underserved neighborhoods)
   • Focus on quick wins with existing infrastructure support

   Phase 2 (Year 2): Add {int((int(total_count * 0.10) - bob_count) * 0.35)} branches
   • Continue regional expansion
   • Enter new regional clusters identified in cluster analysis
   • Evaluate Phase 1 performance and adjust strategy

   Phase 3 (Year 3): Add {int((int(total_count * 0.10) - bob_count) * 0.25)} branches
   • Fill remaining gaps in network coverage
   • Optimize branch network based on performance data
   • Consider branch format innovation (micro-branches, mobile branches)

   Expected Impact:
   • Achieve 10% market share within 3 years
   • Balanced growth across Baku and regional markets
   • Improved competitive position from #8 to top 5

5. NETWORK OPTIMIZATION (PRIORITY: LOW)

   Current Situation:
   • Some branches located in extremely high-competition areas
   • Potential for underperformance in oversaturated markets
   • Digital channels can extend reach without physical expansion

   Recommended Actions:
   • Conduct performance audit of existing {bob_count} branches
   • Identify underperforming branches (bottom quartile by revenue/customers)
   • Consider relocating 2-3 underperforming branches to gap areas
   • Invest in digital banking to serve customers in areas without branches
   • Implement ATM network expansion as lower-cost alternative in some locations

   Expected Impact:
   • Improved ROI per branch
   • Better resource allocation
   • Extended service coverage with lower capital investment

================================================================================
KEY PERFORMANCE INDICATORS TO TRACK
================================================================================

1. Market Share Metrics:
   • Total branch count vs competitors
   • Market share percentage (target: 10% within 3 years)
   • Rank position (target: Top 5 within 3 years)

2. Geographic Coverage:
   • Regional branch percentage (target: >40% within 2 years)
   • Number of cities with BoB presence
   • Average customer distance to nearest branch

3. Competitive Metrics:
   • Average competitive intensity per branch
   • Market gaps closed (target: 50% of identified {len(gaps)} gaps within 3 years)
   • New branch success rate in gap areas

4. Financial Performance:
   • Revenue per branch
   • Customer acquisition cost
   • Branch ROI by location type (Baku vs Regional)

================================================================================
CONCLUSION
================================================================================

Bank of Baku currently holds a modest position in the Azerbaijan banking market
with {bob_count} branches ({bob_count/total_count*100:.1f}% market share, ranked #{bob_rank}). However, significant
growth opportunities exist:

STRENGTHS:
✓ Strong presence in Baku ({bob_region['Baku']} branches)
✓ Established brand and infrastructure
✓ Opportunities for strategic expansion with minimal direct competition

OPPORTUNITIES:
✓ {len(gaps)} identified gap locations with competitor presence but no BoB branch
✓ Regional markets significantly underserved (only {bob_region['Regions']/bob_count*100:.1f}% of branches)
✓ Clear path to 10% market share with {int(total_count * 0.10) - bob_count} strategic branch additions

CHALLENGES:
⚠ High competitive intensity in Baku ({bob_avg_intensity:.1f} competitors per branch within 10km)
⚠ Below-average regional coverage compared to competitors
⚠ Significant gap to market leaders (Kapital Bank: {branch_counts.max()} branches)

RECOMMENDATION PRIORITY:
1. Focus on Regional Expansion (immediate action)
2. Use data-driven location selection (Chart 13 Growth Opportunity Map)
3. Balanced growth: 60% regional, 40% Baku suburbs
4. Target: 10% market share, Top 5 position within 3 years

================================================================================
END OF REPORT
================================================================================

For detailed visualizations, refer to charts:
• Chart 1-4: Market position and competitive landscape
• Chart 5-8: Geographic and density analysis
• Chart 9: Gap analysis with specific opportunities
• Chart 10-12: Competitive dynamics
• Chart 13: Growth opportunity heatmap with recommended locations
• Chart 14-15: Multi-metric comparison and executive summary

All charts saved in: charts/ directory
Generated by: Bank Branch Network Analysis System
"""

with open('docs/STRATEGIC_INSIGHTS.txt', 'w', encoding='utf-8') as f:
    f.write(insights_report)

print(f"✓ Strategic Insights Report saved to docs/STRATEGIC_INSIGHTS.txt")
print()

# ============================================================================
# SUMMARY
# ============================================================================
print("=" * 80)
print("ANALYSIS COMPLETE!")
print("=" * 80)
print()
print(f"✓ All 15 charts saved to charts/ directory")
print()
print("Charts generated:")
print("  1. Branch Count Comparison")
print("  2. Market Share Analysis")
print("  3. Geographic Distribution - All Banks")
print("  4. Bank of Baku vs Top Competitors")
print("  5. Regional Clustering Analysis")
print("  6. Baku City Analysis")
print("  7. Baku vs Regions Coverage")
print("  8. Competitive Density Analysis")
print("  9. Gap Analysis - Underserved Areas")
print(" 10. Nearest Competitor Analysis")
print(" 11. Competitive Intensity Index")
print(" 12. Market Share by Geographic Quadrants")
print(" 13. Growth Opportunity Score")
print(" 14. Multi-Metric Comparison")
print(" 15. Strategic Recommendations Summary")
print()
print("=" * 80)
print("KEY INSIGHTS FOR BANK OF BAKU:")
print("=" * 80)
print(f"• Current Position: Rank #{bob_rank} with {bob_count} branches ({bob_count/total_count*100:.1f}% market share)")
print(f"• Baku Concentration: {bob_region['Baku']/bob_count*100:.1f}% of branches")
print(f"• Expansion Opportunities: {len(gaps)} high-potential locations identified")
print(f"• Competitive Intensity: {bob_avg_intensity:.1f} competitors within 10km average")
print(f"• Growth Target: {int(total_count * 0.10) - bob_count} branches needed for 10% market share")
print("=" * 80)
