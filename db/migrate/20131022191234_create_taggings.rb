class CreateTaggings < ActiveRecord::Migration[5.2]
  def change
    create_table :taggings do |t|
      t.belongs_to :tag
      t.belongs_to :plan

      t.timestamps
    end
    #add_index :taggings, :tag_id
    #add_index :taggings, :plan_id
  end
end
