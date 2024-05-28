<?php

namespace Drupal\colven\Plugin\views\field;

use Drupal\views\ResultRow;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\Component\Serialization\Json;

/**
 * Field handler to output products in JSON format.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("products_json")
 */
class ProductsJson extends FieldPluginBase
{

  /**
   * {@inheritdoc}
   */
  public function render(ResultRow $values)
  {
    $entity = $values->_entity;
    if (isset($entity->products_json)) {
      // Encode the products array to JSON
      $json = Json::encode($entity->products_json);
      return $json;
    }
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function query()
  {
    // Do not query anything for this field.
    $this->addAdditionalFields();
  }

  /**
   * {@inheritdoc}
   */
  public function addAdditionalFields($fields = NULL)
  {
    // Add any additional fields required.
  }
}
