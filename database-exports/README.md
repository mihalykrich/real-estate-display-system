# Database Exports

This directory contains database exports for the Real Estate Display System.

## Files

- **schema.sql** - Database schema only (tables, indexes, constraints)
- **sample-data.sql** - Sample data for testing and demos
- **complete-database.sql** - Complete database (schema + sample data)
- **database-export.json** - JSON format export with metadata

## Usage

### Restore Complete Database
```bash
psql -h localhost -U realestate -d realestate -f complete-database.sql
```

### Restore Schema Only
```bash
psql -h localhost -U realestate -d realestate -f schema.sql
```

### Restore Sample Data Only
```bash
psql -h localhost -U realestate -d realestate -f sample-data.sql
```

## Sample Data Includes

- 1 Admin user (email: admin@realestate.com, password: admin123)
- 5 Sample property displays with different configurations
- 7 Empty display slots (6-12) for testing

## Generated

Generated on: 2025-10-23T16:00:29.393Z
Version: 1.0
